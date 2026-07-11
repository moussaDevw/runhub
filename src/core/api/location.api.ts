import { apiClient } from './client';

export interface AutocompleteSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export const LocationApi = {
  /**
   * Fetch place recommendations from backend proxying Google Places Autocomplete API
   */
  async autocomplete(input: string): Promise<AutocompleteSuggestion[]> {
    if (!input || input.trim().length < 3) return [];
    return apiClient<AutocompleteSuggestion[]>(`/location/autocomplete?input=${encodeURIComponent(input)}`);
  },

  /**
   * Fetch location coords, city, country from placeId using Google Places Details API
   */
  async getDetails(placeId: string): Promise<PlaceDetails> {
    return apiClient<PlaceDetails>(`/location/details?placeId=${placeId}`);
  },
};
