import { useAuthStore } from '../store';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const { user } = useAuthStore.getState();
  const clientId = user?.client_id;

  const headers = {
    'Content-Type': 'application/json',
    ...(clientId ? { 'x-client-id': clientId } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}
