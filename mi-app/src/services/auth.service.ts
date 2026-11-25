import { apiFetch } from './api';

export type SessionUser = { id: string; email: string; fullName: string; role: 'client' | 'technician' | 'admin' };
export type LoginResponse = { accessToken: string; user: SessionUser };
export const authService = <T = unknown>(endpoint: string, bodyData: object) => apiFetch<T>(endpoint, {
  method: 'POST', body: JSON.stringify(bodyData),
});
