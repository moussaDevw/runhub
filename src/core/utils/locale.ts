/**
 * Locale utilities using expo-localization (native APIs).
 *
 * getCalendars() reads the *device* calendar settings — including the
 * 24-hour / 12-hour clock toggle — directly from iOS / Android native
 * APIs.  This is the only reliable source of truth; the Hermes Intl
 * polyfill does NOT honour the system clock-format preference.
 *
 * getLocales() returns the ordered list of user-preferred locales
 * (e.g. "en-US", "fr-FR") configured at the OS level.
 */

import { getCalendars, getLocales } from 'expo-localization';

/* ------------------------------------------------------------------ */
/*  Device locale                                                      */
/* ------------------------------------------------------------------ */

/** Full BCP-47 locale tag from the device, e.g. "en-US" or "fr-SN". */
export function getDeviceLocale(): string {
  const locales = getLocales();
  return locales[0]?.languageTag ?? 'fr-FR';
}

/** Two-letter language code, e.g. "en" or "fr". */
export function getDeviceLanguage(): string {
  const locales = getLocales();
  return locales[0]?.languageCode ?? 'fr';
}

/** true when the device's primary language starts with "en". */
export function isEnglish(): boolean {
  return getDeviceLanguage().startsWith('en');
}

/* ------------------------------------------------------------------ */
/*  Clock format                                                       */
/* ------------------------------------------------------------------ */

/**
 * Returns `true` when the user's device is configured for 24-hour
 * clock display.  Falls back to `true` (the most common non-US
 * default) if detection fails.
 */
export function uses24HourClock(): boolean {
  const calendars = getCalendars();
  // uses24hourClock can be boolean | null
  return calendars[0]?.uses24hourClock ?? true;
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

/**
 * Format an ISO date-time string's **time** portion according to the
 * device's clock-format preference.
 *
 * Examples:
 *   - 24 h device  → "21:30"
 *   - 12 h device  → "9:30 PM"
 */
export function formatTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const h12 = !uses24HourClock();
  return date.toLocaleTimeString(getDeviceLocale(), {
    hour: 'numeric',
    minute: '2-digit',
    hour12: h12,
  });
}

/**
 * Format an ISO date-time string's **date** portion with locale-aware
 * weekday / day / month presentation.
 *
 * When the date is today or tomorrow the function returns a
 * human-friendly label ("Today", "Aujourd'hui", etc.).
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const en = isEnglish();

  if (date.toDateString() === now.toDateString()) {
    return en ? 'Today' : "Aujourd'hui";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return en ? 'Tomorrow' : 'Demain';
  }

  return date.toLocaleDateString(getDeviceLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Short uppercase day label for event cards.
 *
 * Examples: "AUJ.", "DEM.", "LUN", "TODAY", "TOM.", "MON"
 */
export function getDayLabel(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const en = isEnglish();

  if (date.toDateString() === now.toDateString()) {
    return en ? 'TODAY' : 'AUJ.';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return en ? 'TOM.' : 'DEM.';
  }

  const day = date.toLocaleDateString(getDeviceLocale(), { weekday: 'short' });
  return day.replace('.', '').toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Price formatting                                                   */
/* ------------------------------------------------------------------ */

/**
 * Format a numeric price for display.
 *
 * Examples:
 *   - 0     → "Gratuit" / "Free"
 *   - 2500  → "2 500 F" / "2,500 F"
 */
export function formatPrice(value: number): string {
  if (!value) return isEnglish() ? 'Free' : 'Gratuit';
  return `${value.toLocaleString(getDeviceLocale())} F`;
}
