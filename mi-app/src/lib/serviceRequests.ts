import { apiFetch } from '@/services/api';
import type { ServiceRequestData } from '@/types/service-request';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type WorkRequest = {
  id: string;
  description: string;
  address: string;
  neighborhood?: string | null;
  phone?: string | null;
  urgency?: string | null;
  status: RequestStatus;
  createdAt: string;
  category?: { id: number; name: string };
};

export async function createServiceRequest(data: ServiceRequestData): Promise<{ id: string }> {
  if (data.categoryId == null) throw new Error('Debes seleccionar una categoría.');
  if (!localStorage.getItem('token')) throw new Error('Debes iniciar sesión como cliente para publicar.');
  return apiFetch<{ id: string }>('service-requests', {
    method: 'POST',
    body: JSON.stringify({
      categoryId: data.categoryId,
      description: data.description,
      address: data.address,
      neighborhood: data.neighborhood,
      phone: data.phone,
      urgency: data.urgency,
    }),
  });
}
export const clientRequests = () => apiFetch<WorkRequest[]>('service-requests/mine');
export const technicianAvailable = () => apiFetch<WorkRequest[]>('service-requests/technician/available');
export const technicianMine = () => apiFetch<WorkRequest[]>('service-requests/technician/mine');
export const actionRequest = (id: string, action: 'cancel' | 'accept' | 'reject' | 'start' | 'complete', role: 'client' | 'technician') =>
  apiFetch(`service-requests/${role === 'client' ? `${id}/cancel` : `technician/${id}/${action}`}`, { method: 'PATCH' });
