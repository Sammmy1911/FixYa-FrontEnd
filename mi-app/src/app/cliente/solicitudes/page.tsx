"use client";
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clientRequests, technicianAvailable, technicianMine, actionRequest, type WorkRequest, type RequestStatus } from '@/lib/serviceRequests';

type StoredUser = { id: string; fullName?: string; role: 'client' | 'technician' | 'admin' };
const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente', accepted: 'Aceptada', in_progress: 'En progreso',
  completed: 'Completada', cancelled: 'Cancelada',
};
export default function RequestsPage() {
  const router = useRouter();
  const isTech = false;
  const [user, setUser] = useState<StoredUser | null>(null);
  const [items, setItems] = useState<WorkRequest[]>([]);
  const [myItems, setMyItems] = useState<WorkRequest[]>([]);
  const [tab, setTab] = useState<'available' | 'mine'>('available');
  const [history, setHistory] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError('');
    try {
      if (isTech) {
        const [available, mine] = await Promise.all([technicianAvailable(), technicianMine()]);
        setItems(available); setMyItems(mine);
      } else {
        setMyItems(await clientRequests());
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudieron cargar las solicitudes.'); }
    finally { setLoading(false); }
  }, [isTech]);

  useEffect(() => {
    let parsed: StoredUser | null = null;
    try { parsed = JSON.parse(localStorage.getItem('user') || 'null') as StoredUser; } catch { parsed = null; }
    if (!localStorage.getItem('token') || !parsed || parsed.role !== (isTech ? 'technician' : 'client')) {
      router.replace('/auth/login'); return;
    }
    const session = parsed;
    void Promise.resolve().then(() => { setUser(session); return refresh(); });
  }, [router, isTech, refresh]);

  async function perform(id: string, action: 'cancel' | 'accept' | 'reject' | 'start' | 'complete') {
    setBusy(id);setError('');setMessage('');
    try { await actionRequest(id, action, isTech ? 'technician' : 'client'); await refresh(); setMessage('Solicitud actualizada.'); }
    catch (e) {setError(e instanceof Error ? e.message : 'La operación falló.');}
    finally {setBusy(null);}
  }

  const list = isTech ? (tab === 'available' ? items : myItems) : myItems.filter(item => history === (item.status === 'completed' || item.status === 'cancelled'));
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary-strong">FixYa<span className="text-primary">.</span></Link>
          <div className="flex items-center gap-3 text-sm"><span className="hidden text-muted sm:block">{user?.fullName || 'Mi cuenta'}</span>
            <button className="rounded-lg border border-line px-4 py-2 font-semibold hover:bg-surface" onClick={() => {localStorage.removeItem('token');localStorage.removeItem('user');router.replace('/auth/login');}}>Cerrar sesión</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-5 sm:py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-primary-strong">Panel {isTech ? 'del técnico' : 'del cliente'}</p>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{isTech ? 'Gestión de trabajos' : 'Mis solicitudes'}</h1>
            <p className="mt-2 text-sm text-muted">{isTech ? 'Consulta nuevas oportunidades y administra tus servicios.' : 'Sigue el estado de tus servicios publicados.'}</p>
          </div>
          {!isTech && <Link href="/solicitar" className="rounded-xl bg-primary-strong px-5 py-3 text-center text-sm font-bold text-white hover:brightness-95">+ Solicitar servicio</Link>}
        </div>
        {!isTech && <div className="flex flex-wrap gap-2"><button className={`rounded-lg px-4 py-2 ${!history ? "bg-primary-strong text-white" : "bg-white"}`} onClick={() => setHistory(false)}>Activos</button><button className={`rounded-lg px-4 py-2 ${history ? "bg-primary-strong text-white" : "bg-white"}`} onClick={() => setHistory(true)}>Historial</button></div>}
        {isTech && <div className="flex flex-wrap gap-2 border-b border-line pb-3">
          <button onClick={() => setTab('available')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'available' ? 'bg-primary-strong text-white' : 'bg-white text-body'}`}>Disponibles ({items.length})</button>
          <button onClick={() => setTab('mine')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'mine' ? 'bg-primary-strong text-white' : 'bg-white text-body'}`}>Mis trabajos ({myItems.length})</button>
        </div>}
        <button type="button" disabled={loading || busy !== null} onClick={() => {setLoading(true); void refresh();}} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold">{loading ? 'Actualizando…' : 'Actualizar solicitudes'}</button>
        {error && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
        {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{message}</p>}
        {loading ? <div role="status" className="fixya-loading rounded-xl border border-line bg-white p-5 text-muted">Cargando solicitudes…</div> : list.length === 0 ? <div className="rounded-2xl border border-line bg-white p-10 text-center text-muted">{isTech && tab === 'available' ? 'No hay solicitudes disponibles. Si acabas de registrarte, un administrador debe verificar tu perfil.' : 'Aún no hay solicitudes en este apartado.'}</div> :
          <div className="grid gap-4 md:grid-cols-2">{list.map((item) => <article key={item.id} className="fixya-card min-w-0 rounded-2xl border border-[#dae4e7] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-wide text-primary-strong">{item.category?.name || 'Servicio'}</span>
              <span className="fixya-status rounded-full px-3 py-1 text-xs font-semibold" data-status={item.status}>{statusLabels[item.status] || item.status}</span></div>
            {item.status === 'pending' && item.hasRecommendation && <p className="mb-3 rounded-lg bg-cyan-50 p-2 text-sm font-semibold text-cyan-800">Encontramos un técnico compatible. Pendiente de aceptación.</p>}
            <h2 className="mb-3 break-words text-lg font-bold">{item.description}</h2>
            <p className="break-words text-sm text-muted">📍 {item.address}{item.neighborhood ? ` · ${item.neighborhood}` : ''}</p>
            {item.urgency && <p className="mt-1 text-xs text-muted">Urgencia: {item.urgency === 'asap' ? 'Lo antes posible' : item.urgency === 'later' ? 'Hoy más tarde' : 'Programado'}</p>}
            <p className="mt-2 text-xs text-muted">Publicado: {new Date(item.createdAt).toLocaleString('es-CO')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {isTech && tab === 'available' && item.status === 'pending' && <>
                <button disabled={busy !== null} onClick={() => void perform(item.id,'accept')} className="rounded-lg bg-primary-strong px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Aceptar trabajo</button>
                <button disabled={busy !== null} onClick={() => void perform(item.id,'reject')} className="rounded-lg border border-line px-4 py-2 text-sm font-bold disabled:opacity-50">Rechazar</button>
              </>}
              {isTech && tab === 'mine' && item.status === 'accepted' && <button disabled={busy !== null} onClick={() => void perform(item.id,'start')} className="rounded-lg bg-primary-strong px-4 py-2 text-sm font-bold text-white">Iniciar trabajo</button>}
              {isTech && tab === 'mine' && item.status === 'in_progress' && <button disabled={busy !== null} onClick={() => void perform(item.id,'complete')} className="rounded-lg bg-primary-strong px-4 py-2 text-sm font-bold text-white">Marcar completado</button>}
              {!isTech && item.status === 'pending' && <button disabled={busy !== null} onClick={() => {if (window.confirm('¿Cancelar esta solicitud?')) void perform(item.id,'cancel');}} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Cancelar solicitud</button>}
            </div>
          </article>)}</div>}
      </section>
    </main>
  );
}
