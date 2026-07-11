import { useQuery } from '@tanstack/react-query';
import { EventsApi, EventItemResponse } from '../api/events.api';

export function useEventsList() {
  return useQuery<EventItemResponse[]>({
    queryKey: ['events'],
    queryFn: () => EventsApi.getAllEvents(),
  });
}

export function useEventDetail(id: string) {
  return useQuery<EventItemResponse>({
    queryKey: ['event', id],
    queryFn: () => EventsApi.getEvent(id),
    enabled: !!id,
  });
}
