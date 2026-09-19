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

export interface ClubJoinRequest {
  id: string;
  clubId: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
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
  isMember?: boolean;
  isFollower?: boolean;
  joinRequestStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  myRole?: 'OWNER' | 'ADMIN' | 'MEMBER' | null;
  verified: boolean;
}
