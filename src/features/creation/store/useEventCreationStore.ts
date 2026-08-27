import { create } from 'zustand';

export interface EventCreationState {
  editingEventId?: string;
  title: string;
  description: string;
  sportId: string;
  startsAt: string;
  endsAt?: string;
  venueName: string;
  capacity?: number;
  price: number;
  /** Explicit toggle for the paid section UI — independent from price so the user can enable
   *  pricing before entering an amount. */
  isPaidToggle: boolean;
  coords?: { lat: number; lng: number };
  googlePlaceId?: string;
  city?: string;
  country?: string;
  coverUrl: string | null;
  coverKey: string | null;
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
    editingEventId: undefined,
    title: '',
    description: '',
    sportId: '',
    startsAt: tomorrow.toISOString(),
    endsAt: undefined,
    venueName: '',
    capacity: undefined,
    price: 0,
    isPaidToggle: false,
    coords: undefined,
    googlePlaceId: undefined,
    city: undefined,
    country: undefined,
    coverUrl: null,
    coverKey: null,
  };
};

export const useEventCreationStore = create<EventCreationState>((set) => ({
  ...getInitialState(),
  updateField: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetStore: () => set(getInitialState()),
}));
