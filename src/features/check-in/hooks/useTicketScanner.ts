import { useState, useRef, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

import { AccentColors } from '@/constants/theme';
import { formatPrice } from '@/core/utils/locale';
import { CheckInScanResult } from '@/features/events/api/events.api';
import { useScanTicket } from '@/features/events/hooks/useEvents';
import { parseTicketPayload } from '../utils/check-in.utils';

export type ScanState = 'idle' | 'scanning' | 'valid' | 'used' | 'invalid';

interface UseTicketScannerOptions {
  eventId: string;
  continuousScan?: boolean;
}

export function useTicketScanner({ eventId, continuousScan = false }: UseTicketScannerOptions) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanResult, setScanResult] = useState<CheckInScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const scanLockRef = useRef(false);
  const autoResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTicketMutation = useScanTicket();

  useEffect(() => {
    return () => {
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current);
      }
    };
  }, []);

  const resetScan = useCallback(() => {
    if (autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
    }
    scanLockRef.current = false;
    setScanState('idle');
    setScanResult(null);
    setErrorMessage('');
  }, []);

  // Stabilise la référence à la mutation pour éviter de recréer handleProcessCode à chaque render.
  // TanStack Query recrée l'objet mutation à chaque render (nouvelle référence),
  // ce qui invaliderait le useCallback et provoquerait un remount de CameraView.
  const scanTicketMutationRef = useRef(scanTicketMutation);
  useEffect(() => {
    scanTicketMutationRef.current = scanTicketMutation;
  });

  const handleProcessCode = useCallback((rawCode: string) => {
    const code = parseTicketPayload(rawCode);
    if (!code || scanLockRef.current) return;
    scanLockRef.current = true;
    setScanState('scanning');

    if (!eventId) {
      setErrorMessage("Identifiant de l'événement manquant.");
      setScanState('invalid');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      scanLockRef.current = false;
      return;
    }

    scanTicketMutationRef.current.mutate(
      { eventId, ticketCode: code.trim() },
      {
        onSuccess: (data) => {
          setScanResult(data);
          if (data.status === 'valid' || data.success) {
            setScanState('valid');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            if (continuousScan) {
              if (autoResetTimerRef.current) clearTimeout(autoResetTimerRef.current);
              autoResetTimerRef.current = setTimeout(() => {
                resetScan();
              }, 1500);
            }
          } else if (data.status === 'already_used') {
            setScanState('used');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          } else {
            setErrorMessage(data.message || 'Billet invalide');
            setScanState('invalid');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
          }
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Billet introuvable ou non valide pour cet événement.';
          setErrorMessage(typeof message === 'string' ? message : 'Billet non reconnu');
          setScanState('invalid');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        },
        onSettled: () => {
          scanLockRef.current = false;
        },
      }
    );
  }, [eventId, continuousScan, resetScan]);

  const handleBarcodeScanned = useCallback(({ data }: { data: string }) => {
    if (scanState !== 'idle' || scanLockRef.current) return;
    handleProcessCode(data);
  }, [scanState, handleProcessCode]);

  let frameColor: string = AccentColors.bissap;
  if (scanState === 'valid') frameColor = '#2f6b4d';
  if (scanState === 'used') frameColor = '#d98b2b';
  if (scanState === 'invalid') frameColor = '#b8324f';

  const participantName =
    scanResult?.registration?.user?.firstName || scanResult?.registration?.user?.lastName
      ? `${scanResult?.registration?.user?.firstName || ''} ${scanResult?.registration?.user?.lastName || ''}`.trim()
      : scanResult?.registration?.user?.username
      ? `@${scanResult.registration.user.username}`
      : 'Participant';

  const priceText =
    scanResult?.registration?.event?.price && scanResult.registration.event.price > 0
      ? `Payé · ${formatPrice(scanResult.registration.event.price)}`
      : 'Gratuit';

  return {
    scanState,
    scanResult,
    errorMessage,
    frameColor,
    participantName,
    priceText,
    handleProcessCode,
    handleBarcodeScanned,
    resetScan,
  };
}
