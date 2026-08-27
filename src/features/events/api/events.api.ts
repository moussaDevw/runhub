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
  coverUrl?: string | null;
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

export interface EventItemResponse extends EventResponse {
  sport: {
    id: string;
    slug: string;
    labelFr: string;
    color: string;
  };
  organizer: {
    id: string;
    username?: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  _count: {
    registrations: number;
    likes?: number;
    favoritedBy?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FindAllEventsParams {
  q?: string;
  sportId?: string;
  dateFilter?: 'today' | 'weekend' | 'week' | 'month';
  page?: number;
  limit?: number;
}

export interface RegistrationResponse {
  id: string;
  ticketCode: string;
  status: string;
  createdAt: string;
  event?: {
    id: string;
    title: string;
    startsAt: string;
    venueName: string | null;
  };
}

export interface RegistrationStatusResponse {
  isRegistered: boolean;
  registration: {
    id: string;
    ticketCode: string;
    status: string;
    createdAt: string;
  } | null;
}

export interface ParticipantResponse {
  id: string;
  ticketCode: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export interface MyRegistrationResponse {
  id: string;
  ticketCode: string;
  status: string;
  createdAt: string;
  event: EventItemResponse;
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
   * Modifier un événement existant
   */
  async updateEvent(id: string, payload: Partial<CreateEventPayload>): Promise<EventResponse> {
    return apiClient<EventResponse>(`/events/${id}`, {
      method: 'PATCH',
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
   * Récupérer la liste paginée des événements publiés avec filtres optionnels
   */
  async getAllEvents(params?: FindAllEventsParams): Promise<PaginatedResponse<EventItemResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.sportId) searchParams.set('sportId', params.sportId);
    if (params?.dateFilter) searchParams.set('dateFilter', params.dateFilter);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return apiClient<PaginatedResponse<EventItemResponse>>(`/events${query ? `?${query}` : ''}`);
  },

  /**
   * Récupérer les détails d'un événement par son ID
   */
  async getEvent(id: string): Promise<EventItemResponse> {
    return apiClient<EventItemResponse>(`/events/${id}`);
  },

  /**
   * Récupérer les événements créés par l'utilisateur connecté (tous statuts)
   */
  async getMyEvents(): Promise<EventItemResponse[]> {
    return apiClient<EventItemResponse[]>('/events/mine');
  },

  // --- Registration ---

  /**
   * Inscrire l'utilisateur connecté à un événement
   */
  async register(eventId: string): Promise<RegistrationResponse> {
    return apiClient<RegistrationResponse>(`/events/${eventId}/register`, {
      method: 'POST',
    });
  },

  /**
   * Annuler l'inscription de l'utilisateur
   */
  async cancelRegistration(eventId: string): Promise<void> {
    await apiClient(`/events/${eventId}/register`, { method: 'DELETE' });
  },

  /**
   * Vérifier le statut d'inscription de l'utilisateur pour un événement
   */
  async getRegistrationStatus(eventId: string): Promise<RegistrationStatusResponse> {
    return apiClient<RegistrationStatusResponse>(`/events/${eventId}/registration-status`);
  },

  /**
   * Récupérer les participants d'un événement
   */
  async getParticipants(eventId: string): Promise<ParticipantResponse[]> {
    return apiClient<ParticipantResponse[]>(`/events/${eventId}/participants`);
  },

  /**
   * Récupérer les inscriptions de l'utilisateur connecté (agenda)
   */
  async getMyRegistrations(type?: 'upcoming' | 'past'): Promise<MyRegistrationResponse[]> {
    const query = type ? `?type=${type}` : '';
    return apiClient<MyRegistrationResponse[]>(`/events/registrations/mine${query}`);
  },
};
