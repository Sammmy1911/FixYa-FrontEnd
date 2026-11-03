import type { ServiceRequestData } from "@/types/service-request";

// TODO: reemplazar por la llamada real cuando el backend tenga el endpoint
// de solicitudes (por ejemplo POST /service-requests).
export async function createServiceRequest(
  data: ServiceRequestData,
): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Solicitud simulada:", data);
  return { ok: true };
}
