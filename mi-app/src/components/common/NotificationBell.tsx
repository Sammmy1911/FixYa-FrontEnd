"use client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

type Notice = { id: string; message: string; createdAt: string; readAt: string | null };
export default function NotificationBell() {
  const [items, setItems] = useState<Notice[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try { setItems(await apiFetch<Notice[]>("notifications/mine")); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudieron cargar los avisos."); }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(refresh);
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 10000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  async function mark(id: string) {
    setBusy(id);
    try { await apiFetch(`notifications/${id}/read`, { method: "PATCH" }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo marcar como leida."); }
    finally { setBusy(null); }
  }
  const unread = items.filter(item => !item.readAt).length;
  return <div className="relative">
    <button type="button" aria-label={`Notificaciones, ${unread} sin leer`} aria-expanded={open} onClick={() => { setOpen(v => !v); void refresh(); }} className="relative rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold">🔔 {unread > 0 && <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-xs text-white">{unread}</span>}</button>
    {open && <section aria-label="Notificaciones internas" className="absolute right-0 top-full z-30 mt-2 w-[min(18rem,75vw)] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="flex items-center justify-between gap-2"><h2 className="font-bold">Notificaciones</h2><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar notificaciones">✕</button></div>
      <p className="my-2 text-xs text-slate-500">Avisos internos de FixYa (sin envio por WhatsApp).</p>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <div className="max-h-80 overflow-y-auto">{items.length === 0 ? <p className="py-4 text-sm text-slate-500">No tienes notificaciones.</p> : items.map(item => <article key={item.id} className={`border-t border-slate-100 p-2 ${item.readAt ? "" : "bg-cyan-50"}`}><p className="break-words text-sm">{item.message}</p><p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("es-CO")}</p>{!item.readAt && <button type="button" disabled={busy !== null} onClick={() => void mark(item.id)} className="mt-2 text-xs font-semibold text-cyan-700 disabled:opacity-50">Marcar como leida</button>}</article>)}</div>
    </section>}
  </div>;
}
