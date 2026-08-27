import { EventStatus } from '@/components/ui/managed-event-card';
import { EventItemResponse } from '../api/events.api';

export function getEventStatus(startsAt: string): EventStatus {
  const startsAtTime = new Date(startsAt).getTime();
  const now = Date.now();
  if (startsAtTime < now - 2 * 60 * 60 * 1000) {
    return 'TERMINÉ';
  }
  if (startsAtTime < now) {
    return 'EN COURS';
  }
  return 'À VENIR';
}

export function formatEventDay(startsAt: string): string {
  return new Date(startsAt)
    .toLocaleDateString('fr-FR', { weekday: 'short' })
    .substring(0, 3)
    .toUpperCase();
}

export function formatEventTime(startsAt: string): string {
  return new Date(startsAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEventImageSource(coverUrl?: string | null) {
  return coverUrl
    ? { uri: coverUrl }
    : require('@/assets/images/bg_home.jpeg');
}

export function formatEventPresentation(event: EventItemResponse) {
  const inscribedCount = event._count?.registrations || 0;
  const price = event.price || 0;
  return {
    status: getEventStatus(event.startsAt),
    dateDay: formatEventDay(event.startsAt),
    dateTime: formatEventTime(event.startsAt),
    imageSource: getEventImageSource(event.coverUrl),
    location: event.venueName || 'Dakar',
    inscribedCount,
    maxCapacity: event.capacity || 20,
    revenue: price * inscribedCount,
    isFree: price === 0,
  };
}
