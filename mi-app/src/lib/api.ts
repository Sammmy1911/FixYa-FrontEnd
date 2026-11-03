import type { ApiError } from "@/types/api";

export const API_BASE = "/api";

export function getErrorMessages(data: ApiError): string[] {
  return Array.isArray(data.message) ? data.message : [data.message];
}
