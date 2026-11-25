"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';
import { getAvailability, saveAvailability, type Availability } from '@/lib/serviceRequests';

type Category = { id: number; name: string };
export default function AvailabilityPanel({ onSaved }: { onSaved: () => Promise<void> }) {
  const [config, setConfig] = useState<Availability | null>(null);
  const [zones, setZones] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    void Promise.all([getAvailability(), apiFetch<Category[]>('categories')]).then(([data, cats]) => {
      if (!active) return;
      setConfig(data); setZones(data.coverageZones.join(', ')); setCategories(cats);
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'No se pudo cargar disponibilidad'); });
    return () => { active = false; };
  }, []);
  async function save() {
    if (!config) return;
    setBusy(true); setMessage(''); setError('');
    try {
      const result = await saveAvailability({ ...config, coverageZones: zones.split(',').map(z => z.trim()).filter(Boolean) });
      setConfig(result); setZones(result.coverageZones.join(', ')); setMessage('Disponibilidad guardada.');
      await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
    <h2 className="text-lg font-bold">Mi disponibilidad</h2>
    <p className="text-sm text-muted">Recibe recomendaciones de tu zona. Puedes aceptar otros trabajos aunque desactives esta opción.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {!config ? (!error && <p role="status">Cargando disponibilidad…</p>) : <fieldset disabled={busy} className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={config.autoAvailable} onChange={e => setConfig({...config, autoAvailable:e.target.checked})} /> Disponible para recomendaciones</label>
      <label className="block text-sm font-semibold">Barrios de cobertura (separados por comas)<input className="mt-2 block w-full rounded-lg border border-line p-3" value={zones} onChange={e => setZones(e.target.value)} placeholder="Granada, La Flora" /></label>
      <div><p className="mb-2 text-sm font-semibold">Categorías de servicio</p><div className="flex flex-wrap gap-3">{categories.map(category => <label key={category.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={config.coverageCategories.includes(category.id)} onChange={e => setConfig({...config, coverageCategories: e.target.checked ? [...config.coverageCategories, category.id] : config.coverageCategories.filter(id => id !== category.id)})}/>{category.name}</label>)}</div></div>
      <button type="button" onClick={() => void save()} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Guardando…' : 'Guardar disponibilidad'}</button>
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}
    </fieldset>}
  </section>;
}
