"use client";
import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/services/api";

type Item = { id: string; paidAmount?: number | null; hasReview?: boolean; warrantyOfId?: string | null; warrantyRequestId?: string | null };
type Mode = "warranty" | "review" | "amount";
export default function HistoryActions({ item }: { item: Item }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [reason, setReason] = useState(""); const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [amount, setAmount] = useState(item.paidAmount == null ? "" : String(item.paidAmount));
  const [savedAmount, setSavedAmount] = useState(item.paidAmount ?? null);
  const [reviewed, setReviewed] = useState(Boolean(item.hasReview));
  const [claimId, setClaimId] = useState(item.warrantyRequestId ?? null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  function open(next: Mode) { setMode(next); setError(""); setSuccess(""); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy || !mode) return;
    setError(""); setBusy(true);
    try {
      if (mode === "warranty") {
        const result = await apiFetch<{ id: string }>(`service-requests/${item.id}/warranty`, { method: "POST", body: JSON.stringify({ reason: reason.trim() }) });
        setClaimId(result.id); setSuccess("Lo sentimos por tu experiencia. Hemos recibido tu solicitud de garantía y te asignaremos un técnico para reparar los daños lo antes posible.");
      } else if (mode === "review") {
        if (!rating) throw new Error("Selecciona una calificación de 1 a 5 estrellas.");
        await apiFetch(`service-requests/${item.id}/reviews`, { method: "POST", body: JSON.stringify({ rating, comment: comment.trim() }) });
        setReviewed(true); setSuccess("¡Gracias por compartir tu experiencia!");
      } else {
        const value = Number(amount);
        if (!amount.trim() || !Number.isInteger(value) || value < 0 || value > 100000000) throw new Error("Ingresa un valor válido en pesos colombianos.");
        await apiFetch(`service-requests/${item.id}/paid-amount`, { method: "PATCH", body: JSON.stringify({ amount: value }) });
        setSavedAmount(value); setSuccess("Valor reportado guardado.");
      }
      setMode(null);
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudo guardar."); }
    finally { setBusy(false); }
  }
  const button = "rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50";
  return <>
    {!item.warrantyOfId && !claimId && <button type="button" disabled={busy} onClick={() => open("warranty")} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">Pedir garantía</button>}
    {claimId && <Link className="self-center text-sm font-semibold text-cyan-700 underline" href={`/cliente/seguimiento?id=${encodeURIComponent(claimId)}`}>Garantía solicitada · Ver estado</Link>}
    {!reviewed ? <button type="button" disabled={busy} className={button} onClick={() => open("review")}>Calificar técnico</button> : <span className="self-center text-xs text-emerald-700">Reseña registrada</span>}
    <div className="flex w-full flex-wrap items-center gap-2 text-sm text-slate-600">
      <span>Valor pagado (reportado): {savedAmount === null ? "Sin registrar" : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(savedAmount)}</span>
      <button type="button" disabled={busy} onClick={() => open("amount")} className="font-semibold text-cyan-700 underline">{savedAmount === null ? "Registrar" : "Editar"}</button>
    </div>
    {mode && <form onSubmit={submit} aria-busy={busy} className="w-full space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {mode === "warranty" && <><h3 className="font-bold">Solicitar garantía</h3><label className="block text-sm" htmlFor={`reason-${item.id}`}>¿Por qué reclamas garantía?</label><textarea id={`reason-${item.id}`} required minLength={10} maxLength={500} rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Cuéntanos qué salió mal y qué necesitas reparar." className="w-full rounded-lg border bg-white p-3 text-sm" /></>}
      {mode === "review" && <><h3 className="font-bold">Califica tu experiencia</h3><fieldset><legend className="text-sm">Calificación</legend><div className="flex gap-1">{[1,2,3,4,5].map(n => <button key={n} type="button" aria-label={`${n} estrellas`} aria-pressed={rating === n} onClick={() => setRating(n)} className={`p-2 text-2xl ${n <= rating ? "text-amber-500" : "text-slate-400"}`}>★</button>)}</div></fieldset><label htmlFor={`review-${item.id}`} className="block text-sm">Comentario opcional</label><textarea id={`review-${item.id}`} maxLength={500} rows={3} value={comment} onChange={e => setComment(e.target.value)} className="w-full rounded-lg border bg-white p-3 text-sm" /></>}
      {mode === "amount" && <><label className="block text-sm font-semibold" htmlFor={`amount-${item.id}`}>Valor que pagaste (COP)</label><input id={`amount-${item.id}`} type="number" required min={0} max={100000000} step={1} value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-lg border bg-white p-3" /><p className="text-xs text-slate-500">Dato reportado por ti; no realiza ni verifica pagos.</p></>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2"><button type="submit" disabled={busy || (mode === "review" && !rating)} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Enviando…" : mode === "amount" ? "Guardar valor" : "Enviar"}</button><button type="button" disabled={busy} onClick={() => setMode(null)} className={button}>Cancelar</button></div>
    </form>}
    {success && <p role="status" className="w-full rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
  </>;
}
