import { apiClient } from '@/core/api/client';

export interface CreateEventPayload {
  title: string;
  description?: string;
  sportId: string;
  clubId?: string;
  coverUrl?: string;
  startsAt: string; // ISO String
  endsAt?: string; // ISO String
  venueName?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  price?: number;
  currency?: string;
  visibility?: 'public' | 'unlisted';
  googlePlaceId?: string;
  city?: string;
  country?: string;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  venueName: string | null;
  capacity: number | null;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'cancelled';
  visibility: 'public' | 'unlisted';
  shareSlug: string;
  sportId: string;
  organizerId: string;
  googlePlaceId: string | null;
  city: string | null;
  country: string | null;
  coords?: {
    lat: number;
    lng: number;
  } | null;
}

export const EventsApi = {
  /**
   * Créer un nouvel événement (crée en statut DRAFT par défaut)
   */
  async createEvent(payload: CreateEventPayload): Promise<EventResponse> {
    return apiClient<EventResponse>('/events', {
      method: 'POST',
      body: payload,
    });
  },

  /**
   * Publier un événement (passe le statut de DRAFT à PUBLISHED)
   */
  async publishEvent(id: string): Promise<EventResponse> {
    return apiClient<EventResponse>(`/events/${id}/publish`, {
      method: 'PATCH',
    });
  },

  /**
   * Récupérer la liste de tous les événements publiés
   */
  async getAllEvents(): Promise<EventItemResponse[]> {
    return apiClient<EventItemResponse[]>('/events');
  },

  /**
   * Récupérer les détails d'un événement par son ID
   */
  async getEvent(id: string): Promise<EventItemResponse> {
    return apiClient<EventItemResponse>(`/events/${id}`);
  },
};

export interface EventItemResponse extends EventResponse {
  sport: {
    id: string;
    slug: string;
    labelFr: string;
    color: string;
  };
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  _count: {
    registrations: number;
  };
}
