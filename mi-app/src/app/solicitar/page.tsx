import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ServiceRequestForm from "@/components/solicitud/ServiceRequestForm";

export const metadata: Metadata = {
  title: "Solicitar servicio | FixYa",
};

export default function SolicitarPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface px-4 py-12">
        <Suspense fallback={<p className="text-center text-sm text-muted">Cargando formulario...</p>}>
          <ServiceRequestForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
