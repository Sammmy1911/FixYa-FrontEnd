import type { ServiceRequestData } from "@/types/service-request";

// TODO: reemplazar por la llamada real cuando FG-15 del backend esté en develop
// (POST /service-requests con categoryId, description y address, usuario logueado como cliente).
export async function createServiceRequest(
  data: ServiceRequestData,
): Promise<{ id: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Solicitud simulada:", data);
  return { id: `FY-${Math.floor(10000 + Math.random() * 90000)}` };
}
