import { apiFetch } from './api';

export const authService = async (endpoint: string, bodyData: any) => {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(bodyData),
  });
};