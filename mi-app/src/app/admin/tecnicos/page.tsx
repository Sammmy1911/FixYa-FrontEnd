"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/api';

type Technician = { id: string; fullName: string; email: string; specialty: string | null; isVerified: boolean; documentCount: number };

export default function AdminTechniciansPage() {
  const router = useRouter();
  const [items, setItems] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setItems(await apiFetch<Technician[]>('users/technicians')); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo cargar el listado.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!localStorage.getItem('token') || user?.role !== 'admin') { router.replace('/auth/login'); return; }
    } catch { router.replace('/auth/login'); return; }
    void Promise.resolve().then(refresh);
  }, [router, refresh]);
  async function changeStatus(tech: Technician) {
    const next = !tech.isVerified;
    if (!window.confirm(`${next ? 'Aprobar' : 'Suspender'} a ${tech.fullName}?`)) return;
    setBusy(tech.id); setError(''); setMessage('');
    try {
      await apiFetch(`users/technicians/${tech.id}/verification`, { method: 'PATCH', body: JSON.stringify({ isVerified: next }) });
      setItems(old => old.map(item => item.id === tech.id ? { ...item, isVerified: next } : item));
      setMessage(next ? 'Técnico aprobado.' : 'Técnico suspendido.');
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar el técnico.'); }
    finally { setBusy(null); }
  }
  const visible = items.filter(t => filter === 'all' || t.isVerified === (filter === 'approved'));
  return <main className="min-h-screen bg-surface text-ink">
    <header className="border-b border-line bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <span className="text-2xl font-extrabold text-primary-strong">FixYa.</span>
      <button className="rounded-lg border border-line px-4 py-2 text-sm font-semibold" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.replace('/auth/login'); }}>Cerrar sesión</button>
    </div></header>
    <section className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-strong">Administración</p>
      <h1 className="text-3xl font-bold">Gestión de técnicos</h1>
      <p className="text-muted">Aprueba o suspende el acceso de los técnicos a las solicitudes.</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold" htmlFor="filter">Estado</label>
        <select id="filter" className="rounded-lg border border-line bg-white p-2" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Todos</option><option value="approved">Aprobados</option><option value="blocked">No autorizados</option></select>
        <button disabled={loading || busy !== null} className="rounded-lg border border-line bg-white px-4 py-2 disabled:opacity-50" onClick={() => void refresh()}>Actualizar</button>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{message}</p>}
      {loading ? <p role="status">Cargando técnicos…</p> : !error && visible.length === 0 ? <p className="rounded-xl border border-line bg-white p-6">No hay técnicos en este estado.</p> : <div className="grid gap-4 md:grid-cols-2">{visible.map(tech => <article key={tech.id} className="min-w-0 space-y-3 rounded-xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="break-all text-lg font-bold">{tech.fullName}</h2><span className={`rounded-full px-3 py-1 text-xs font-bold ${tech.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>{tech.isVerified ? 'Aprobado' : 'No autorizado'}</span></div>
        <p className="break-all text-sm text-muted">{tech.email}</p><p className="text-sm">Especialidad: {tech.specialty || 'Sin registrar'}</p><p className="text-sm">Documentos registrados: {tech.documentCount}</p>
        <button disabled={busy !== null} onClick={() => void changeStatus(tech)} className={`rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50 ${tech.isVerified ? 'border border-red-300 text-red-700 hover:bg-red-50' : 'bg-primary-strong text-white hover:brightness-110'}`}>{busy === tech.id ? 'Guardando…' : tech.isVerified ? 'Suspender' : 'Aprobar'}</button>
      </article>)}</div>}
    </section>
  </main>;
}
