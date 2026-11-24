"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

export type ServiceStage = "solicitado" | "asignado" | "en curso" | "finalizado";

export interface ServiceRequestItem {
  id: string;
  status: string;
  description: string;
  address: string;
  neighborhood?: string | null;
  phone?: string;
  createdAt?: string;
  category?: { id: string | number; name: string } | null;
  categoryId?: string | number;
  technician?: { fullName?: string; name?: string; phone?: string } | null;
}

const STAGES: { key: ServiceStage; label: string; expectation: string }[] = [
  {
    key: "solicitado",
    label: "Solicitado",
    expectation: "Recibimos tu solicitud y estamos buscando un técnico disponible.",
  },
  {
    key: "asignado",
    label: "Asignado",
    expectation: "Ya tienes un técnico asignado; revisa sus datos y coordina la llegada.",
  },
  {
    key: "en curso",
    label: "En curso",
    expectation: "El técnico está trabajando en tu servicio en la dirección indicada.",
  },
  {
    key: "finalizado",
    label: "Finalizado",
    expectation: "El servicio fue completado. Puedes revisar el resultado o solicitar garantía.",
  },
];

function normalizeStage(rawStatus?: string): ServiceStage {
  const s = (rawStatus ?? "").toLowerCase().trim().replace(/[_-]+/g, " ");
  if (s.includes("asign")) return "asignado";
  if (s.includes("curso") || s.includes("progress")) return "en curso";
  if (s.includes("final") || s.includes("complet") || s.includes("done")) return "finalizado";
  return "solicitado";
}

export default function ServiceStatusTracker({ initialId }: { initialId?: string }) {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("service-requests");
      const list: ServiceRequestItem[] = Array.isArray(res) ? res : res?.data ?? [];
      setRequests(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(initialId ?? list[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el estado del servicio.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Cargando estado de tus servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={loadRequests}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Aún no tienes solicitudes</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cuando crees una solicitud de servicio, aquí podrás ver su avance paso a paso.
        </p>
      </div>
    );
  }

  const activeRequest = requests.find((r) => r.id === selectedId) ?? requests[0];
  const currentStage = normalizeStage(activeRequest.status);
  const currentIndex = STAGES.findIndex((st) => st.key === currentStage);
  const techName =
    activeRequest.technician?.fullName ?? activeRequest.technician?.name ?? null;

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
            Seguimiento de servicio
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Estado de tu solicitud</h1>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Actualizar estado
        </button>
      </div>

      {requests.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {requests.map((req) => {
            const isSelected = req.id === activeRequest.id;
            return (
              <button
                key={req.id}
                type="button"
                onClick={() => setSelectedId(req.id)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-50 font-semibold text-cyan-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div>{req.category?.name ?? "Servicio"}</div>
                <div className="text-xs opacity-75">{normalizeStage(req.status)}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Stepper de 4 estados */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAGES.map((stage, idx) => {
          const completed = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <div
              key={stage.key}
              className={`rounded-xl border p-3 transition ${
                active
                  ? "border-cyan-500 bg-cyan-50/70"
                  : completed
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-slate-200 bg-slate-50/50 opacity-65"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span
                  className={
                    active
                      ? "text-cyan-700"
                      : completed
                        ? "text-emerald-700"
                        : "text-slate-500"
                  }
                >
                  Paso {idx + 1}
                </span>
                <span>{completed ? "✓" : active ? "•" : ""}</span>
              </div>
              <p className="mt-1 font-semibold text-slate-900">{stage.label}</p>
            </div>
          );
        })}
      </div>

      {/* Qué esperar en el estado actual */}
      <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Estado actual: <span className="text-cyan-700">{STAGES[currentIndex].label}</span>
        </p>
        <p className="mt-1 text-sm text-slate-700">{STAGES[currentIndex].expectation}</p>
      </div>

      {/* Resumen del servicio */}
      <div className="grid gap-3 rounded-xl border border-slate-200 p-4 text-sm sm:grid-cols-2">
        <div>
          <span className="text-slate-500">Categoría: </span>
          <strong className="text-slate-900">
            {activeRequest.category?.name ?? "No especificada"}
          </strong>
        </div>
        <div>
          <span className="text-slate-500">Técnico: </span>
          <strong className="text-slate-900">
            {techName ?? "Pendiente por asignar"}
          </strong>
        </div>
        <div className="sm:col-span-2">
          <span className="text-slate-500">Dirección: </span>
          <strong className="text-slate-900">
            {activeRequest.address}
            {activeRequest.neighborhood ? ` (${activeRequest.neighborhood})` : ""}
          </strong>
        </div>
        <div className="sm:col-span-2">
          <span className="text-slate-500">Descripción: </span>
          <span className="text-slate-800">{activeRequest.description}</span>
        </div>
      </div>
    </section>
  );
}