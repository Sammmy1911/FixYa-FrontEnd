"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";

interface AdminRequestRow {
  id: string;
  status: string;
  description: string;
  address: string;
  createdAt?: string;
  category?: { name: string } | null;
  client?: { fullName?: string; name?: string; email?: string } | null;
  technician?: { fullName?: string; name?: string; email?: string } | null;
}

interface UserRow {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  role: string;
  specialty?: string;
}

const STATUS_LABELS: Record<string, string> = { pending: "Solicitado", accepted: "Asignado", in_progress: "En curso", completed: "Finalizado", cancelled: "Cancelado" };

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AdminRequestRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAdminData() {
    setLoading(true);
    setError(null);
    try {
      const [requestsRes, usersRes] = await Promise.all([
        apiFetch<AdminRequestRow[]>("service-requests/admin/all"),
        apiFetch<UserRow[]>("users"),
      ]);
      setRequests(requestsRes);
      setUsers(usersRes);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el panel administrativo. Verifica tus permisos.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadAdminData);
  }, []);


  if (loading) {
    return (
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Cargando panel administrativo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={loadAdminData}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const technicians = users.filter((u) =>
    String(u.role ?? "").toLowerCase().includes("tech"),
  );

  const totalRequests = requests.length;
  const activeCount = requests.filter(r => ["pending", "accepted", "in_progress"].includes(r.status)).length;
  const finishedCount = requests.filter(r => r.status === "completed").length;
  const techCount = technicians.length;

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
            Administración FixYa
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Panel de control operativo</h1>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Actualizar datos
        </button>
      </div>

      {/* Métricas básicas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total solicitudes</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{totalRequests}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Solicitudes activas</p>
          <p className="mt-2 text-3xl font-extrabold text-cyan-600">{activeCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Finalizadas</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">{finishedCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Técnicos registrados</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{techCount}</p>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Solicitudes de servicio</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3">Técnico</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                    No hay solicitudes registradas.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {req.category?.name ?? "General"}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-slate-700">
                      {req.description}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.address}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {req.technician?.fullName ?? req.technician?.name ?? "Sin asignar"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="fixya-status rounded-full px-3 py-1 text-xs font-semibold" data-status={req.status}>{STATUS_LABELS[req.status] ?? req.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Listado de técnicos */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Técnicos ({technicians.length})
          </h2>
        </div>

        {technicians.length === 0 ? (
          <p className="px-6 py-6 text-sm text-slate-500">
            No hay técnicos registrados todavía.
          </p>
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              >
                <p className="font-bold text-slate-900">
                  {tech.fullName ?? tech.name ?? "Técnico"}
                </p>
                <p className="text-xs text-slate-500">{tech.email}</p>
                {tech.specialty && (
                  <span className="mt-2 inline-block rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">
                    {tech.specialty}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
