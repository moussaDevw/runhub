import { AvatarColors } from '@/constants/theme';

export const AVATAR_COLORS = AvatarColors;

export function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AvatarColors[Math.abs(hash) % AvatarColors.length];
}

export function getUserInitials(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null
): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (username) return username.slice(0, 2).toUpperCase();
  return '??';
}

export function getUserDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null
): string {
  if (firstName || lastName) return `${firstName || ''} ${lastName || ''}`.trim();
  if (username) return `@${username}`;
  return 'Participant';
}

/**
 * Extracts clean 8-char ticket code from raw scanned payload (string, JSON or URL).
 */
export function parseTicketPayload(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const obj = JSON.parse(trimmed);
      if (obj.ticketCode) return String(obj.ticketCode).trim();
      if (obj.code) return String(obj.code).trim();
      if (obj.c) return String(obj.c).trim();
    } catch {}
  }
  const matchUrl = trimmed.match(/(?:ticket\/|tickets\/|code=)([A-HJ-NP-Z2-9]{6,12})/i);
  if (matchUrl && matchUrl[1]) {
    return matchUrl[1];
  }
  const matchCode = trimmed.match(/[A-HJ-NP-Z2-9]{8}/i);
  if (matchCode) {
    return matchCode[0];
  }
  return trimmed;
}
