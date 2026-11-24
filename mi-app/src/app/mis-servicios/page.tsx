import type { Metadata } from "next";
import ServiceStatusTracker from "@/components/solicitud/ServiceStatusTracker";

export const metadata: Metadata = {
  title: "Estado de mi servicio | FixYa",
};

export default function MisServiciosPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <ServiceStatusTracker />
    </main>
  );
}