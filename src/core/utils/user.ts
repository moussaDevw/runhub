/**
 * User display utilities.
 *
 * Centralises the repeated organizer name/initials computation
 * that was previously duplicated across 4+ screens.
 */

interface OrganizerLike {
  firstName: string | null;
  lastName: string | null;
}

interface OrganizerDisplay {
  /** Full display name, e.g. "Moussa Diagne" or "Un membre". */
  name: string;
  /** Uppercase initials, e.g. "MD" or "M". */
  initials: string;
}

/**
 * Derive display name & initials from an organizer-like object.
 *
 * Handles null / empty firstName / lastName gracefully.
 */
export function getOrganizerDisplay(organizer: OrganizerLike): OrganizerDisplay {
  if (organizer.firstName && organizer.lastName) {
    return {
      name: `${organizer.firstName} ${organizer.lastName}`,
      initials: `${organizer.firstName[0]}${organizer.lastName[0]}`.toUpperCase(),
    };
  }
  return { name: 'Un membre', initials: 'M' };
}
