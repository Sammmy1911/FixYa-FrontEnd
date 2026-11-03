const API_URL = 'http://localhost:3000'; // URL de tu backend en NestJS

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Obtener el token del localStorage si existe (para rutas protegidas)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Si hay token, lo adjuntamos automáticamente en las peticiones
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Ocurrió un error en la petición');
  }

  return data;
};