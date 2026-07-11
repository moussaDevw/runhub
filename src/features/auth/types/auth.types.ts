export interface User {
  id: string;
  email: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  city?: string | null;
  avatarUrl?: string | null;
  onboardingCompleted: boolean;
  isAdmin?: boolean;
  notifEnabled?: boolean;
  ecoData?: boolean;
  coords?: { lat: number; lng: number } | null;
  sports?: {
    id: string;
    slug: string;
    labelFr: string;
    color: string;
  }[];
}

export interface VerifyOAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type VerifyOtpResponse = VerifyOAuthResponse;
