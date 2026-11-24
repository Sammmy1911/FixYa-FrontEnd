import type { Metadata } from "next";
import ServiceHistoryList from "@/components/solicitud/ServiceHistoryList";

export const metadata: Metadata = {
  title: "Historial de servicios | FixYa",
};

export default function HistorialPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <ServiceHistoryList />
    </main>
  );
}