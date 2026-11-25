const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new Error('No se pudo conectar con FixYa. Comprueba que el backend esté encendido.');
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    const data = body as { message?: string | string[] } | null;
    const msg = data?.message;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg || `Error HTTP ${response.status}`);
  }
  return body as T;
}
