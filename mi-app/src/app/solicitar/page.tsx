import type { Metadata } from "next";
import ServiceRequestForm from "@/components/solicitud/ServiceRequestForm";

export const metadata: Metadata = {
  title: "Solicitar servicio | FixYa",
};

export default function SolicitarPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <ServiceRequestForm />
    </main>
  );
}
