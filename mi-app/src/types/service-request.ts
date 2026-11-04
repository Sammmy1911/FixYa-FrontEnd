export type Urgency = "asap" | "later" | "scheduled";

export type ServiceRequestData = {
  categoryId: number | null;
  description: string;
  address: string;
  neighborhood: string;
  phone: string;
  urgency: Urgency;
  /** Foto de referencia opcional. Aún no se envía al backend. */
  photo: File | null;
};
