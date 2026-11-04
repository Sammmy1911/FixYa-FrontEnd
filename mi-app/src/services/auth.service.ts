import { apiFetch } from './api';

export const authService = async (endpoint: string, bodyData: object) => {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(bodyData),
  });
};