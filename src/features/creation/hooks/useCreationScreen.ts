import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useAllSports } from '@/features/sports/hooks/useSports';
import { useEventCoverUpload } from './useEventCoverUpload';
import { useEventCreationStore } from '../store/useEventCreationStore';
import { useEventDetail } from '@/features/events/hooks/useEvents';
import { EventsApi } from '@/features/events/api/events.api';

export function useCreationScreen() {
  const router = useRouter();
  const { user: _user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Cover photo upload hook
  const { isUploading, pickAndUploadImage, removeCover } = useEventCoverUpload();

  // Zustand Store selectors
  const editingEventId = useEventCreationStore((state) => state.editingEventId);
  const title = useEventCreationStore((state) => state.title);
  const description = useEventCreationStore((state) => state.description);
  const sportId = useEventCreationStore((state) => state.sportId);
  const startsAt = useEventCreationStore((state) => state.startsAt);
  const venueName = useEventCreationStore((state) => state.venueName);
  const capacity = useEventCreationStore((state) => state.capacity);
  const price = useEventCreationStore((state) => state.price);
  const coords = useEventCreationStore((state) => state.coords);
  const googlePlaceId = useEventCreationStore((state) => state.googlePlaceId);
  const city = useEventCreationStore((state) => state.city);
  const country = useEventCreationStore((state) => state.country);
  const coverUrl = useEventCreationStore((state) => state.coverUrl);
  const isPaid = useEventCreationStore((state) => state.isPaidToggle);
  const updateField = useEventCreationStore((state) => state.updateField);
  const resetStore = useEventCreationStore((state) => state.resetStore);

  const { id } = useGlobalSearchParams<{ id?: string }>();


  const { data: event, isLoading: isLoadingEvent } = useEventDetail(id || '');

  // Local states (UI only, not persisted in store)
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Populate store when editing an existing event
  useEffect(() => {
    if (id && event && editingEventId !== id) {
      updateField('editingEventId', id);
      updateField('title', event.title);
      updateField('description', event.description || '');
      updateField('sportId', event.sportId);
      updateField('startsAt', event.startsAt);
      updateField('venueName', event.venueName || '');
      updateField('capacity', event.capacity || undefined);
      updateField('price', event.price);
      updateField('coords', event.coords ? { lat: event.coords.lat, lng: event.coords.lng } : undefined);
      updateField('googlePlaceId', event.googlePlaceId || undefined);
      updateField('city', event.city || undefined);
      updateField('country', event.country || undefined);
      updateField('coverUrl', event.coverUrl || null);
      updateField('isPaidToggle', event.price > 0);
    }
  }, [id, event, editingEventId, updateField]);

  useEffect(() => {
    if (!id && editingEventId) {
      resetStore();
      // isPaid resets automatically since price resets to 0 in the store
    }
  }, [id, editingEventId, resetStore]);

  // Dynamic sports from backend
  const { data: sportsList = [], isLoading: isLoadingSports } = useAllSports();
  const selectedSport = sportsList.find((s) => s.id === sportId);

  const handleSave = async () => {
    if (!editingEventId) return;
    setIsSaving(true);
    try {
      await EventsApi.updateEvent(editingEventId, {
        title,
        description: description || undefined,
        sportId,
        startsAt,
        venueName,
        capacity,
        price,
        coords,
        googlePlaceId,
        city,
        country,
        coverUrl: coverUrl || undefined,
      });

      // Invalidate React Query caches
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', editingEventId] });

      // Clean Zustand creation state
      resetStore();

      // Redirect to event details
      router.push(`/event/${editingEventId}` as any);
    } catch (err) {
      console.error('Erreur lors de la modification de l\'événement:', err);
      const message = err instanceof Error ? err.message : "Impossible de modifier l'événement. Veuillez réessayer.";
      Alert.alert("Erreur", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectLocation = (
    name: string,
    coordinates: { lat: number; lng: number } | undefined,
    placeId?: string,
    cityName?: string,
    countryName?: string
  ) => {
    if (!name) {
      updateField('venueName', '');
      updateField('coords', undefined);
      updateField('googlePlaceId', undefined);
      updateField('city', undefined);
      updateField('country', undefined);
    } else {
      updateField('venueName', name);
      updateField('coords', coordinates);
      updateField('googlePlaceId', placeId);
      updateField('city', cityName);
      updateField('country', countryName);
    }
    setShowLocationModal(false);
  };

  const handleSelectSport = (id: string) => {
    updateField('sportId', id);
    setShowSportModal(false);
  };


  const isFormValid = useMemo(() => {
    return (
      title.trim().length > 0 &&
      sportId.trim().length > 0 &&
      venueName.trim().length > 0 &&
      startsAt.length > 0 &&
      (!isPaid || price > 0)
    );
  }, [title, sportId, venueName, startsAt, isPaid, price]);

  const isLoadingData = isLoadingSports || (!!id && isLoadingEvent);

  return {
    editingEventId,
    title,
    description,
    sportId,
    startsAt,
    venueName,
    capacity,
    price,
    coords,
    coverUrl,
    sportsList,
    selectedSport,
    isUploading,
    pickAndUploadImage,
    removeCover,
    updateField,
    isPaid,
    setIsPaid: (val: boolean) => updateField('isPaidToggle', val),
    isSaving,
    handleSave,
    showLocationModal,
    setShowLocationModal,
    showSportModal,
    setShowSportModal,
    handleSelectLocation,
    handleSelectSport,
    isFormValid,
    isLoadingData,
    goBack: () => {
      if (editingEventId) {
        resetStore();
      }
      router.back();
    },
    goToPreview: () => router.push('/apercu'),
    t,
  };
}
