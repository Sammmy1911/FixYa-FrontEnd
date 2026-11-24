"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/services/api";

export interface HistoryServiceItem {
  id: string;
  status: string;
  description: string;
  address: string;
  neighborhood?: string | null;
  phone?: string;
  createdAt?: string;
  category?: { id: string | number; name: string } | null;
  categoryId?: string | number;
  technician?: { fullName?: string; name?: string } | null;
}

function formatDate(iso?: string): string {
  if (!iso) return "Fecha no disponible";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(rawStatus?: string): { label: string; style: string } {
  const s = (rawStatus ?? "").toLowerCase().trim().replace(/[_-]+/g, " ");
  if (s.includes("final") || s.includes("complet") || s.includes("done")) {
    return { label: "Finalizado", style: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (s.includes("curso") || s.includes("progress")) {
    return { label: "En curso", style: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (s.includes("asign")) {
    return { label: "Asignado", style: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  return { label: "Solicitado", style: "bg-slate-100 text-slate-700 border-slate-200" };
}

function isFinished(rawStatus?: string): boolean {
  const s = (rawStatus ?? "").toLowerCase();
  return s.includes("final") || s.includes("complet") || s.includes("done");
}

function buildRehireUrl(item: HistoryServiceItem, mode: "rehire" | "warranty"): string {
  const params = new URLSearchParams();
  const catId = item.category?.id ?? item.categoryId;
  if (catId !== undefined && catId !== null) params.set("categoryId", String(catId));
  if (item.address) params.set("address", item.address);
  if (item.neighborhood) params.set("neighborhood", item.neighborhood);
  if (item.phone) params.set("phone", item.phone);

  const baseDesc = item.description ?? "";
  const description =
    mode === "warranty"
      ? `[Garantía solicitud #${item.id.slice(0, 8)}] ${baseDesc}`.slice(0, 500)
      : baseDesc;

  if (description) params.set("description", description);
  return `/solicitar?${params.toString()}`;
}

export default function ServiceHistoryList() {
  const [items, setItems] = useState<HistoryServiceItem[]>([]);
  const [filter, setFilter] = useState<"all" | "finished">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("service-requests");
      const list: HistoryServiceItem[] = Array.isArray(res) ? res : res?.data ?? [];
      setItems(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cargar tu historial.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Cargando historial de servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={loadHistory}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const visibleItems =
    filter === "finished" ? items.filter((i) => isFinished(i.status)) : items;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
            Mis solicitudes
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Historial de servicios</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === "all"
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Todos ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("finished")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === "finished"
                ? "bg-cyan-500 font-semibold text-slate-950"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Finalizados
          </button>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            No tienes servicios en esta vista
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Solicita un técnico verificado para tu hogar y aquí quedará guardado tu historial.
          </p>
          <Link
            href="/solicitar"
            className="mt-5 inline-block rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Pedir un servicio
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((item) => {
            const badge = getStatusBadge(item.status);
            const finished = isFinished(item.status);
            const techName =
              item.technician?.fullName ?? item.technician?.name ?? "Sin asignar";

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {item.category?.name ?? "Servicio general"}
                      </h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.style}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Solicitado el {formatDate(item.createdAt)} · Técnico: {techName}
                    </p>
                  </div>

                  <Link
                    href="/mis-servicios"
                    className="text-xs font-semibold text-cyan-600 hover:underline"
                  >
                    Ver estado →
                  </Link>
                </div>

                <p className="mt-3 text-sm text-slate-700">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Dirección: {item.address}
                  {item.neighborhood ? ` (${item.neighborhood})` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={buildRehireUrl(item, "rehire")}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Volver a contratar
                  </Link>

                  {finished && (
                    <Link
                      href={buildRehireUrl(item, "warranty")}
                      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                    >
                      Reclamar garantía
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}