import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAgendaEvents, useMyEvents } from '@/features/events/hooks/useEvents';

export const groupEvents = (events: any[], isPast: boolean) => {
  const groups: Record<string, any[]> = {};
  const now = new Date();
  
  events.forEach((reg) => {
    const eventDate = new Date(reg.event.startsAt);
    let groupKey = '';

    if (isPast) {
      const month = eventDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      groupKey = month.toUpperCase();
    } else {
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        groupKey = 'agenda.thisWeek';
      } else if (diffDays <= 14) {
        groupKey = 'agenda.nextWeek';
      } else if (diffDays <= 30) {
        groupKey = 'agenda.thisMonth';
      } else {
        groupKey = 'agenda.later';
      }
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(reg);
  });

  return Object.entries(groups).map(([key, data]) => ({
    titleKey: key,
    events: data,
  }));
};

export function useAgendaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const type = selectedTab === 0 ? 'upcoming' : 'past';
  const { data: agendaEvents = [], refetch: refetchAgenda, isRefetching: isRefetchingAgenda } = useAgendaEvents(type);
  const { data: myEvents = [], refetch: refetchMyEvents, isRefetching: isRefetchingMyEvents } = useMyEvents();

  const onRefresh = useCallback(() => {
    refetchAgenda();
    refetchMyEvents();
  }, [refetchAgenda, refetchMyEvents]);

  const isRefreshing = isRefetchingAgenda || isRefetchingMyEvents;
  
  const groupedAgendaEvents = useMemo(() => {
    return groupEvents(agendaEvents, selectedTab === 1);
  }, [agendaEvents, selectedTab]);

  const handleNavigateManageEvents = () => router.push('/manage-events' as any);
  const handleNavigateExplore = () => router.push('/(tabs)/explorer' as any);
  const handleNavigateEventDetail = (id: string) => router.push(`/event/${id}` as any);

  return {
    t,
    selectedTab,
    setSelectedTab,
    myEventsCount: myEvents.length,
    agendaEvents,
    groupedAgendaEvents,
    isRefreshing,
    onRefresh,
    handleNavigateManageEvents,
    handleNavigateExplore,
    handleNavigateEventDetail,
  };
}
