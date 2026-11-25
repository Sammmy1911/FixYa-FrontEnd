"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RolePage({ role, children }: { role: "admin" | "client"; children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        const user = JSON.parse(localStorage.getItem("user") ?? "null");
        if (!localStorage.getItem("token") || user?.role !== role) { router.replace("/auth/login"); return; }
        setReady(true);
      } catch { router.replace("/auth/login"); }
    });
    return () => { active = false; };
  }, [role, router]);
  if (!ready) return <p role="status" className="p-6">Comprobando sesión…</p>;
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4 text-sm font-semibold">
      <span className="text-xl font-extrabold text-cyan-700">FixYa.</span>
      {role === "admin" ? <><Link href="/admin/panel">Panel de control</Link><Link href="/admin/tecnicos">Gestión de técnicos</Link></> : <><Link href="/cliente/solicitudes">Mis solicitudes</Link><Link href="/cliente/seguimiento">Seguimiento</Link><Link href="/cliente/historial">Historial</Link></>}
      <button className="ml-auto rounded-lg border px-3 py-2" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.replace("/auth/login"); }}>Cerrar sesión</button>
    </nav></header>
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</div>
  </main>;
}
