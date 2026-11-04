export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export type Status = 'pending'|'accepted'|'in_progress'|'completed'|'cancelled';
export type ServiceRequest = { id: string; description: string; address: string; status: Status; createdAt: string; category?: { id: number; name: string } };
export type Category = { id: number; name: string; description?: string };
export type LoginResult = { accessToken: string; user: { id: string; fullName: string; email: string; role: 'client'|'technician'|'admin' } };
export async function api<T>(path: string, token = '', method = 'GET', body?: unknown): Promise<T> {
 const res = await fetch(`${API_URL}${path}`, { method, headers: { ...(token ? {Authorization: `Bearer ${token}`} : {}), ...(body !== undefined ? {'Content-Type':'application/json'} : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined, cache:'no-store' });
 if (!res.ok) { const error = await res.json().catch(() => ({})) as {message?: string|string[]}; throw new Error(Array.isArray(error.message) ? error.message.join(', ') : (error.message || `Error HTTP ${res.status}`)); }
 return res.json() as Promise<T>;
}
export function readSession(expected: 'client'|'technician') {
 if (typeof window === 'undefined') return null;
 const token = sessionStorage.getItem('fixya_token');
 try { const user = JSON.parse(sessionStorage.getItem('fixya_user') || 'null') as LoginResult['user']|null;
   return token && user?.role === expected ? {token,user} : null;
 } catch { return null; }
}
export function signOut(){sessionStorage.removeItem('fixya_token');sessionStorage.removeItem('fixya_user');}
export const statusLabel: Record<Status,string> = {pending:'Pendiente',accepted:'Aceptada',in_progress:'En ejecución',completed:'Completada',cancelled:'Cancelada'};
