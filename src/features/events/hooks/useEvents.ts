import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EventsApi,
  EventItemResponse,
  FindAllEventsParams,
  PaginatedResponse,
  ParticipantResponse,
  RegistrationStatusResponse,
  MyRegistrationResponse,
} from '../api/events.api';

/**
 * Fetches paginated published events with optional filters.
 */
export function useEventsList(params?: FindAllEventsParams) {
  return useQuery<PaginatedResponse<EventItemResponse>>({
    queryKey: ['events', params],
    queryFn: () => EventsApi.getAllEvents(params),
  });
}

/**
 * Fetches a single event by ID.
 */
export function useEventDetail(id: string) {
  return useQuery<EventItemResponse>({
    queryKey: ['event', id],
    queryFn: () => EventsApi.getEvent(id),
    enabled: !!id,
  });
}

/**
 * Fetches events created by the current user (all statuses: DRAFT, PUBLISHED, CANCELLED).
 * Calls the dedicated /events/mine endpoint.
 */
export function useMyEvents() {
  return useQuery<EventItemResponse[]>({
    queryKey: ['events', 'mine'],
    queryFn: () => EventsApi.getMyEvents(),
  });
}

/**
 * Fetches the current user's event registrations (for agenda).
 */
export function useAgendaEvents(type?: 'upcoming' | 'past') {
  return useQuery<MyRegistrationResponse[]>({
    queryKey: ['registrations', 'mine', type],
    queryFn: () => EventsApi.getMyRegistrations(type),
  });
}

/**
 * Fetches participants of a specific event.
 */
export function useEventParticipants(eventId: string) {
  return useQuery<ParticipantResponse[]>({
    queryKey: ['event', eventId, 'participants'],
    queryFn: () => EventsApi.getParticipants(eventId),
    enabled: !!eventId,
  });
}

/**
 * Checks if the current user is registered for a specific event.
 */
export function useRegistrationStatus(eventId: string) {
  return useQuery<RegistrationStatusResponse>({
    queryKey: ['event', eventId, 'registration-status'],
    queryFn: () => EventsApi.getRegistrationStatus(eventId),
    enabled: !!eventId,
  });
}

/**
 * Mutation: Register for an event.
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => EventsApi.register(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'registration-status'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'participants'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'mine'] });
    },
  });
}

/**
 * Mutation: Cancel registration for an event.
 */
export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => EventsApi.cancelRegistration(eventId),
    onSuccess: (_data, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'registration-status'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'participants'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', 'mine'] });
    },
  });
}
