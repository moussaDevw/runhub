import { useState } from 'react';
import { useToggleCheckIn } from '@/features/events/hooks/useEvents';

export function useCheckInToggle(eventId: string) {
  const [mutatingRegistrationId, setMutatingRegistrationId] = useState<string | null>(null);
  const toggleCheckInMutation = useToggleCheckIn();

  const handleToggle = (registrationId: string) => {
    if (!eventId) return;
    setMutatingRegistrationId(registrationId);
    toggleCheckInMutation.mutate(
      { eventId, registrationId },
      {
        onSettled: () => setMutatingRegistrationId(null),
      }
    );
  };

  return {
    mutatingRegistrationId,
    handleToggle,
    isPending: toggleCheckInMutation.isPending,
  };
}
