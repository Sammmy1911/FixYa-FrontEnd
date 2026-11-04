import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixYa | Servicios para el hogar",
  description: "Encuentra servicios técnicos para el hogar y gestiona tus solicitudes en FixYa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
