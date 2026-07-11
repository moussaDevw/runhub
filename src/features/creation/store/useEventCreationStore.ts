import { create } from 'zustand';

export interface EventCreationState {
  title: string;
  description: string;
  sportId: string;
  startsAt: string;
  endsAt?: string;
  venueName: string;
  capacity?: number;
  price: number;
  coords?: { lat: number; lng: number };
  googlePlaceId?: string;
  city?: string;
  country?: string;
  updateField: <K extends keyof Omit<EventCreationState, 'updateField' | 'resetStore'>>(
    key: K,
    value: EventCreationState[K]
  ) => void;
  resetStore: () => void;
}

const getInitialState = () => {
  // Par défaut, demain à 18h30
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 30, 0, 0);

  return {
    title: '',
    description: '',
    sportId: '',
    startsAt: tomorrow.toISOString(),
    endsAt: undefined,
    venueName: '',
    capacity: undefined,
    price: 0,
    coords: undefined,
    googlePlaceId: undefined,
    city: undefined,
    country: undefined,
  };
};

export const useEventCreationStore = create<EventCreationState>((set) => ({
  ...getInitialState(),
  updateField: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetStore: () => set(getInitialState()),
}));
