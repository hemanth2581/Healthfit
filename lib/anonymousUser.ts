const USER_ID_KEY = 'healthfit_user_id';

export function getClientUserId(): string {
  if (typeof window === 'undefined') {
    return '00000000-0000-0000-0000-000000000000';
  }

  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId || !isValidUUID(userId)) {
      userId = crypto.randomUUID();
      localStorage.setItem(USER_ID_KEY, userId);
      // Also store in document cookie for server requests
      document.cookie = `${USER_ID_KEY}=${userId}; path=/; max-age=31536000; SameSite=Lax`;
    }
    return userId;
  } catch {
    return crypto.randomUUID();
  }
}

export function setClientUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_ID_KEY, userId);
    document.cookie = `${USER_ID_KEY}=${userId}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // ignore
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

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
