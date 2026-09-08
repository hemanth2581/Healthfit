const USER_ID_KEY = 'healthfit_user_id';

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Retrieves the persistent anonymous user UUID from localStorage or cookie.
 * If none exists, generates a new one, saves it, and returns it.
 */
export function getClientUserId(): string {
  if (typeof window === 'undefined') {
    return '00000000-0000-0000-0000-000000000000';
  }

  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId || !isValidUUID(userId)) {
      userId = crypto.randomUUID();
      localStorage.setItem(USER_ID_KEY, userId);
      document.cookie = `${USER_ID_KEY}=${userId}; path=/; max-age=31536000; SameSite=Lax`;
    }
    return userId;
  } catch {
    return crypto.randomUUID();
  }
}

export const getAnonymousUserId = getClientUserId;

export function setClientUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_ID_KEY, userId);
    document.cookie = `${USER_ID_KEY}=${userId}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore storage errors
  }
}

export function resetClientUserId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  try {
    const newUserId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, newUserId);
    document.cookie = `${USER_ID_KEY}=${newUserId}; path=/; max-age=31536000; SameSite=Lax`;
    return newUserId;
  } catch {
    return crypto.randomUUID();
  }
}
