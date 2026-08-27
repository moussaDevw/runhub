export interface Coords {
  lat: number;
  lng: number;
}

export interface CreateClubPayload {
  name: string;
  handle: string;
  bio?: string;
  logoUrl?: string;
  coverUrl?: string;
  baseName?: string;
  coords?: Coords;
}

export interface ClubResponse {
  id: string;
  name: string;
  handle: string;
  bio: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  baseName: string | null;
  coords: Coords | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
    followers: number;
    events: number;
  };
}
