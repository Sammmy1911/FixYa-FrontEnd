"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/services/api";
import { createServiceRequest } from "@/lib/serviceRequests";
import FigmaIcon from "@/components/ui/FigmaIcon";
import { getCategoryMeta, normalizeName } from "@/components/solicitud/categoryMeta";
import type { Category } from "@/types/api";
import type { ServiceRequestData, Urgency } from "@/types/service-request";

type Step = 1 | 2 | "done";
type FieldErrors = Partial<Record<"categoryId" | "description" | "address" | "phone", string>>;

const emptyData: ServiceRequestData = {
  categoryId: null,
  description: "",
  address: "",
  neighborhood: "",
  phone: "",
  urgency: "asap",
  photo: null,
};

const MAX_DESCRIPTION = 500;
const MAX_PHOTO_MB = 10;

const inputClass =
  "h-12 w-full rounded-lg border border-line bg-white text-sm text-ink shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20";

const urgencyOptions: {
  value: Urgency;
  title: string;
  hint: string;
  icon: { name: string; w: number; h: number };
}[] = [
  { value: "asap", title: "Lo antes posible", hint: "Urgencia inmediata", icon: { name: "6456d", w: 13.333, h: 16.667 } },
  { value: "later", title: "Hoy más tarde", hint: "Jornada tarde/noche", icon: { name: "83e40", w: 16.667, h: 16.667 } },
  { value: "scheduled", title: "Programar fecha", hint: "Elige día y hora", icon: { name: "56ee3", w: 16.667, h: 16.667 } },
];

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex gap-2 pt-1">
      <div className="flex flex-1 flex-col gap-1">
        <span className="h-1.5 rounded-full bg-primary" />
        <span className={`text-[11px] leading-5 ${step === 1 ? "font-bold text-primary" : "font-medium text-primary-strong"}`}>
          {step === 1 ? "1. DETALLE DEL SERVICIO" : "1. Avería y fotos"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className={`h-1.5 rounded-full ${step === 2 ? "bg-primary" : "bg-[#d3e4fe]"}`} />
        <span className={`text-[11px] leading-5 ${step === 2 ? "font-bold text-primary-strong" : "text-muted"}`}>
          {step === 1 ? "2. UBICACIÓN Y HORARIO" : "2. Ubicación y contacto"}
        </span>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs leading-4 text-red-600">{message}</p>;
}

export default function ServiceRequestForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("categoria");

  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<ServiceRequestData>(emptyData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch("categories")
      .then((list: Category[]) => {
        if (!active) return;
        setCategories(list);
        if (preselected) {
          const match = list.find((c) => normalizeName(c.name) === normalizeName(preselected));
          if (match) setData((prev) => ({ ...prev, categoryId: prev.categoryId ?? match.id }));
        }
      })
      .catch(() => {
        if (active) setCategoriesError(true);
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey, preselected]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function retryCategories() {
    setCategoriesError(false);
    setLoadingCategories(true);
    setReloadKey((k) => k + 1);
  }

  function update<K extends keyof ServiceRequestData>(field: K, value: ServiceRequestData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function onPhotoChange(file: File | undefined) {
    setPhotoError(null);
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Solo se permiten imágenes JPG o PNG.");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setPhotoError(`La imagen supera los ${MAX_PHOTO_MB} MB.`);
      return;
    }
    update("photo", file);
  }

  function validateStep1(): boolean {
    const next: FieldErrors = {};
    if (data.categoryId === null) next.categoryId = "Elige el tipo de servicio.";
    if (data.description.trim().length < 10)
      next.description = "Describe el problema con al menos 10 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2(): boolean {
    const next: FieldErrors = {};
    if (data.address.trim().length < 5)
      next.address = "Escribe la dirección donde necesitas el servicio.";
    if (!/^3\d{9}$/.test(data.phone.replace(/\s/g, "")))
      next.phone = "Escribe un celular de 10 dígitos, por ejemplo 300 123 4567.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      const result = await createServiceRequest({
        ...data,
        description: data.description.trim(),
        address: data.address.trim(),
        neighborhood: data.neighborhood.trim(),
        phone: data.phone.replace(/\s/g, ""),
      });
      setRequestId(result.id);
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setData(emptyData);
    setErrors({});
    setRequestId(null);
    setStep(1);
  }

  const selectedCategory = categories.find((c) => c.id === data.categoryId);
  const selectedMeta = selectedCategory ? getCategoryMeta(selectedCategory.name) : null;
  const fullAddress = [data.address.trim(), data.neighborhood.trim()].filter(Boolean).join(" - ");

  /* ---------- Confirmación ---------- */
  if (step === "done") {
    return (
      <div className="mx-auto flex w-full max-w-[576px] flex-col gap-6">
        <section className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white px-6 py-8 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.05),0px_1px_2px_-1px_rgba(15,23,42,0.05)] sm:px-8">
          <div className="pointer-events-none absolute -left-20 -top-20 size-48 rounded-full bg-primary/10 blur-[64px]" />
          <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-[rgba(218,226,253,0.3)] blur-[64px]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative my-2">
              <div className="flex size-24 items-center justify-center rounded-full bg-[#ecfeff] shadow-[0px_0px_0px_8px_rgba(236,254,255,0.6)]">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
                  <FigmaIcon name="d9b4c" width={36.167} height={36.167} />
                </div>
              </div>
              <span className="absolute bottom-0 right-1 rounded-full bg-white p-1 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <span className="relative flex size-3.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative size-3.5 rounded-full bg-primary-strong" />
                </span>
              </span>
            </div>
            <h1 className="pt-3 text-[28px] font-bold leading-10 tracking-[-0.64px] text-ink sm:text-[32px]">
              ¡Solicitud enviada!
            </h1>
            <p className="max-w-[448px] pt-1 text-base font-medium leading-6 text-primary-strong">
              Buscaremos un técnico verificado de {selectedCategory?.name ?? "la categoría elegida"} para ti
            </p>
            <span className="mt-3 mb-4 flex items-center gap-1.5 rounded-full border border-[#a5f3fc] bg-[#ecfeff] px-3 py-1 text-[11px] font-bold leading-[14px] tracking-[0.275px] text-[#0891b2]">
              <FigmaIcon name="217ee" width={10.667} height={13.333} />
              Búsqueda automática en Cali • Radio 5 km
            </span>
          </div>

          <div className="relative flex flex-col gap-3 rounded-[12px] border border-[#dae2fd] bg-surface-low p-6">
            <div className="flex items-center justify-between border-b border-[rgba(203,213,225,0.3)] pb-2">
              <span className="text-xs font-medium leading-4 text-muted">Número de radicado</span>
              <button
                type="button"
                onClick={() => requestId && navigator.clipboard?.writeText(requestId)}
                className="flex items-center gap-1.5 rounded-md border border-line/40 bg-white px-3 py-1 font-mono text-lg font-bold leading-6 tracking-[-0.45px] text-ink"
                title="Copiar radicado"
              >
                #{requestId}
                <FigmaIcon name="8af35" width={11.333} height={13.333} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line/40 bg-white">
                  {selectedMeta && (
                    <FigmaIcon name={selectedMeta.icon.name} width={12.225} height={14.663} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs leading-4 text-muted">Servicio solicitado</span>
                  <span className="block text-sm font-semibold leading-5 text-ink">
                    {selectedCategory?.name} a domicilio
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line/40 bg-white">
                  <FigmaIcon name="5fa98" width={12} height={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs leading-4 text-muted">Dirección asignada</span>
                  <span className="block truncate text-sm font-semibold leading-5 text-ink">
                    {fullAddress}
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-1 flex items-start gap-2.5 rounded-lg border border-line/20 bg-white/80 px-3 pb-3 pt-2">
              <FigmaIcon name="433f5" width={15} height={19.5} />
              <p className="text-xs leading-[19.5px] font-medium text-body">
                <strong className="font-semibold text-ink">Tiempo estimado de respuesta:</strong> En menos
                de 10 minutos un técnico aceptará tu servicio y te contactará.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col gap-3 pt-6">
            <p className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-muted">
              Siguientes pasos automáticos
            </p>
            {[
              {
                n: 1,
                title: "Confirmación vía WhatsApp / SMS",
                text: "Hemos enviado los datos preliminares y el enlace de rastreo a tu número telefónico registrado.",
                icon: "aa935",
                active: true,
              },
              {
                n: 2,
                title: "Verificación de llegada del técnico",
                text: "Podrás ver en pantalla foto en vivo, cédula de ciudadanía verificada y placa de su vehículo.",
                icon: "f4968",
                active: false,
              },
            ].map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-3 rounded-[12px] border border-line/40 bg-surface p-3"
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center self-start rounded-full text-sm font-bold ${
                    s.active ? "bg-primary text-white" : "bg-[#dae2fd] text-primary-strong"
                  }`}
                >
                  {s.n}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold leading-5 text-ink">{s.title}</span>
                  <span className="block text-xs leading-4 text-muted">{s.text}</span>
                </span>
                <FigmaIcon name={s.icon} width={16.667} height={16.667} />
              </div>
            ))}
          </div>

          <div className="relative mt-6 flex items-center gap-3 rounded-[12px] border border-[#cffafe] bg-[#ecfeff] p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(8,145,178,0.1)]">
              <FigmaIcon name="9e10c" width={14.667} height={18.333} />
            </span>
            <span>
              <span className="block text-xs font-bold leading-4 tracking-[0.24px] text-[#0e7490]">
                Servicio 100% Asegurado por FixYa
              </span>
              <span className="block text-xs leading-4 text-[rgba(14,116,144,0.9)]">
                Antecedentes judiciales revisados y garantía de reparación de hasta 30 días.
              </span>
            </span>
          </div>

          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              title="Disponible cuando el backend exponga el estado de la solicitud"
              className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border border-[#e2e8f0] bg-white px-4 py-3 text-sm font-semibold tracking-[0.14px] text-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FigmaIcon name="4c43e" width={15} height={15} />
              Ver estado en vivo
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-primary px-4 py-3 text-sm font-semibold tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95"
            >
              <FigmaIcon name="b8dbe" width={10.5} height={10.5} />
              Hacer otra solicitud
            </button>
          </div>

          <div className="relative mt-6 flex flex-col gap-2 border-t border-line/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-1.5 text-xs leading-4 text-muted">
              <FigmaIcon name="e28c5" width={15.038} height={15.038} />
              ¿Es una fuga urgente o emergencia?
            </span>
            <a
              href="https://wa.me/"
              className="flex items-center gap-1 text-xs font-semibold leading-4 text-primary-strong hover:underline"
            >
              WhatsApp directo FixYa
              <FigmaIcon name="8bec9" width={10.667} height={10.667} />
            </a>
          </div>
        </section>

        <p className="flex items-center justify-center gap-2 py-2 text-center text-xs leading-4 text-muted">
          <FigmaIcon name="929c9" width={15} height={15} />
          ¿Dudas con este radicado? Llámanos a la línea nacional gratuita 01 8000 123 456
        </p>
      </div>
    );
  }

  /* ---------- Paso 2 ---------- */
  if (step === 2) {
    return (
      <div className="mx-auto flex w-full max-w-[620px] flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-xs font-semibold leading-4 tracking-[0.24px] text-body hover:text-ink"
          >
            <FigmaIcon name="bed14" width={12} height={12} />
            Paso anterior: Detalles de la avería
          </button>
          <span className="flex items-center gap-1 rounded-full border border-line/30 bg-surface-low px-3 py-1 text-[11px] font-bold leading-[14px] tracking-[0.44px] text-primary-strong">
            <FigmaIcon name="0022d" width={12.833} height={12.25} />
            Red Cali Verificada
          </span>
        </div>

        <div className="flex flex-col gap-6 rounded-[12px] border border-line bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-line pb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
                  Solicitar servicio a domicilio
                </h2>
                <p className="text-xs leading-4 text-body">Paso 2 de 2: Ubicación y contacto</p>
              </div>
              {selectedCategory && selectedMeta && (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-surface-low px-3 py-1.5 text-xs font-bold leading-4 tracking-[0.24px] text-primary-strong">
                  <FigmaIcon name={selectedMeta.icon.name} width={12.225} height={14.663} />
                  {selectedCategory.name}
                </span>
              )}
            </div>
            <ProgressBar step={2} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FigmaIcon name="2b7a8" width={16} height={20} />
              <h1 className="text-[22px] font-semibold leading-7 tracking-[-0.22px] text-ink">
                ¿Dónde estás?
              </h1>
            </div>
            <p className="text-sm leading-[22.75px] text-body">
              Envía tu dirección para calcular el tiempo de llegada del técnico más cercano en Cali y
              alrededores.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
                Dirección completa
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                  <FigmaIcon name="f2706" width={11.667} height={16.667} />
                </span>
                <input
                  id="address"
                  value={data.address}
                  maxLength={300}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Calle 5 # 38-25, apto 301"
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
              <p className="text-xs leading-4 text-muted">
                Incluye torre, bloque, casa o número de apartamento.
              </p>
              <FieldError message={errors.address} />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label htmlFor="neighborhood" className="text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
                  Barrio <span className="text-xs font-normal text-muted">(opcional)</span>
                </label>
                <span className="text-[11px] font-medium leading-[16.5px] text-primary-strong">
                  Cobertura: Norte, Sur, Oeste y Jamundí
                </span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                  <FigmaIcon name="0f248" width={13.333} height={16.667} />
                </span>
                <input
                  id="neighborhood"
                  value={data.neighborhood}
                  onChange={(e) => update("neighborhood", e.target.value)}
                  placeholder="Ej. San Fernando, Granada, El Peñón"
                  className={`${inputClass} pl-10 pr-4`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
                Celular de contacto
              </label>
              <div className="flex rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <span className="flex items-center gap-1.5 rounded-l-lg border border-r-0 border-line bg-surface-low px-3.5 text-xs font-semibold tracking-[0.24px] text-ink">
                  <span aria-hidden className="inline-flex h-3 w-[18px] flex-col overflow-hidden rounded-[2px]"><span className="h-1/2 bg-[#FCD116]" /><span className="h-1/4 bg-[#003893]" /><span className="h-1/4 bg-[#CE1126]" /></span>+57
                </span>
                <div className="relative flex-1">
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={12}
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="300 123 4567"
                    className={`${inputClass} rounded-l-none pl-3 pr-10 shadow-none`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FigmaIcon name="cdf88" width={16.667} height={16.667} />
                  </span>
                </div>
              </div>
              <p className="flex items-center gap-1 text-xs leading-4 text-muted">
                <FigmaIcon name="73d4b" width={12.5} height={12.5} />
                Recibirás la confirmación y datos del técnico por SMS y WhatsApp.
              </p>
              <FieldError message={errors.phone} />
            </div>

            <fieldset className="flex flex-col gap-2 pt-2">
              <legend className="pb-2 text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
                ¿Cuándo lo necesitas?
              </legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {urgencyOptions.map((opt) => {
                  const selected = data.urgency === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => update("urgency", opt.value)}
                      className={`flex flex-col items-start rounded-lg p-3.5 text-left ${
                        selected ? "border-2 border-primary bg-surface-low" : "border border-line bg-white hover:border-primary/50"
                      }`}
                    >
                      <span className="flex w-full items-center justify-between pb-1">
                        <FigmaIcon name={opt.icon.name} width={opt.icon.w} height={opt.icon.h} />
                        {opt.value === "asap" && (
                          <span className="rounded bg-primary px-1.5 text-[10px] font-bold leading-[15px] text-white">
                            15-30 min
                          </span>
                        )}
                      </span>
                      <span className={`text-xs leading-4 tracking-[0.24px] text-ink ${selected ? "font-bold" : "font-semibold"}`}>
                        {opt.title}
                      </span>
                      <span className={`pt-0.5 text-[11px] leading-[16.5px] ${selected ? "font-medium text-primary-strong" : "text-muted"}`}>
                        {opt.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex items-start gap-3 rounded-lg border border-line/60 bg-surface-low p-3">
              <FigmaIcon name="e7752" width={14.667} height={20.333} />
              <p className="text-xs leading-4">
                <span className="block font-bold text-ink">
                  Pago seguro al finalizar el servicio. Sin cobros sorpresa.
                </span>
                <span className="block pt-0.5 text-muted">
                  Tarifa estándar acordada antes de iniciar la labor con garantía de 30 días.
                </span>
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-12 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-6 text-sm font-semibold tracking-[0.14px] text-ink hover:bg-surface-low"
              >
                <FigmaIcon name="4830c" width={12} height={12} />
                Atrás
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95 disabled:opacity-60"
              >
                <FigmaIcon name="e5b10" width={13.333} height={16.667} />
                {submitting ? "Enviando..." : "Solicitar servicio"}
              </button>
            </div>
          </div>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs leading-4 text-muted">
          <li className="flex items-center gap-1">
            <FigmaIcon name="40b1e" width={13.333} height={13.333} />
            Técnicos con cédula verificada
          </li>
          <li className="flex items-center gap-1">
            <FigmaIcon name="68120" width={10.667} height={13.333} />
            Servicios asegurados
          </li>
          <li className="flex items-center gap-1">
            <FigmaIcon name="2c49f" width={11.333} height={12} />
            Precios transparentes en COP
          </li>
        </ul>
      </div>
    );
  }

  /* ---------- Paso 1 ---------- */
  return (
    <section className="mx-auto w-full max-w-[672px] overflow-hidden rounded-[12px] border border-line bg-white shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06),0px_2px_6px_-1px_rgba(15,23,42,0.04)]">
      <header className="flex flex-col gap-4 border-b border-line px-6 pb-8 pt-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
            Solicitar servicio a domicilio
          </h1>
          <span className="rounded-full bg-surface-low px-2.5 py-0.5 text-xs font-semibold leading-4 tracking-[0.24px] text-primary-strong">
            Paso 1 de 2: Cuéntanos qué necesitas
          </span>
        </div>
        <ProgressBar step={1} />
      </header>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">¿Qué necesitas?</h2>
          <p className="text-xs leading-4 text-muted">
            Selecciona la categoría principal para asignarte al técnico especialista más cercano.
          </p>

          {loadingCategories && <p className="pt-2 text-sm text-muted">Cargando servicios...</p>}
          {categoriesError && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              No pudimos cargar los servicios.
              <button type="button" onClick={retryCategories} className="ml-2 font-semibold underline">
                Reintentar
              </button>
            </div>
          )}

          <div role="radiogroup" aria-label="Categorías de servicio" className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
            {categories.map((c) => {
              const m = getCategoryMeta(c.name);
              const selected = data.categoryId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update("categoryId", c.id)}
                  className={`relative flex flex-col items-center justify-center rounded-[12px] px-3 py-[18px] text-center transition ${
                    selected
                      ? "border-2 border-primary bg-surface-low drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "border border-line bg-white hover:border-primary/50"
                  }`}
                >
                  <span className={`mb-2 flex size-12 items-center justify-center rounded-full ${selected ? "bg-white" : "bg-surface-low"}`}>
                    <FigmaIcon name={m.icon.name} width={m.icon.w} height={m.icon.h} />
                  </span>
                  <span className={`text-sm leading-5 tracking-[0.14px] text-ink ${selected ? "font-bold" : "font-semibold"}`}>
                    {c.name}
                  </span>
                  {m.subtitle && <span className="pt-0.5 text-[11px] leading-5 text-muted">{m.subtitle}</span>}
                  {selected && (
                    <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
                      <FigmaIcon name="3ad68" width={9.508} height={7.015} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.categoryId} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="description" className="text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
              ¿Cuál es el problema o detalle del servicio?
            </label>
            <span className="text-[11px] font-bold leading-[14px] text-muted">
              {data.description.length}/{MAX_DESCRIPTION}
            </span>
          </div>
          <textarea
            id="description"
            rows={4}
            maxLength={MAX_DESCRIPTION}
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="La llave del lavaplatos gotea y no cierra bien..."
            className="w-full resize-y rounded-[12px] border border-line bg-white p-4 text-sm leading-5 text-ink outline-none placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <FieldError message={errors.description} />
          <p className="flex items-center gap-1.5 pt-1 text-xs leading-4 text-muted">
            <FigmaIcon name="ac463" width={13.333} height={13.333} />
            Sé lo más descriptivo posible para que el técnico lleve los repuestos adecuados.
          </p>
        </div>

        <div className="flex flex-col gap-2 pb-2">
          <p className="text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
            Subir foto de referencia <span className="font-normal text-muted">(opcional)</span>
          </p>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onPhotoChange(e.dataTransfer.files?.[0]);
            }}
            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[12px] border-2 border-dashed border-line bg-surface p-[18px] text-center hover:border-primary/60"
          >
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => onPhotoChange(e.target.files?.[0])}
            />
            <span className="flex size-10 items-center justify-center rounded-full border border-line bg-white">
              <FigmaIcon name="583c6" width={20.167} height={18.333} />
            </span>
            {data.photo ? (
              <span className="text-xs font-semibold leading-4 text-ink">
                {data.photo.name}{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    update("photo", null);
                  }}
                  className="font-semibold text-primary-strong underline"
                >
                  Quitar
                </button>
              </span>
            ) : (
              <span className="text-xs leading-4 text-ink">
                <span className="font-semibold text-primary-strong underline">Toca para cargar</span> o
                arrastra una imagen aquí
              </span>
            )}
            <span className="text-xs leading-4 text-muted">
              JPG o PNG hasta 10MB (ayuda a estimar costos con exactitud)
            </span>
          </label>
          {photoError && <p className="text-xs text-red-600">{photoError}</p>}
        </div>

        <button
          type="button"
          onClick={() => validateStep1() && setStep(2)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-primary py-3.5 text-sm font-semibold tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95"
        >
          Continuar al Paso 2
          <FigmaIcon name="77060" width={13.333} height={13.333} />
        </button>

        <div className="flex items-center gap-3 rounded-lg border border-[#cffafe] bg-surface-low p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#a5f3fc] bg-[#ecfeff]">
            <FigmaIcon name="4af3b" width={13.333} height={16.667} />
          </span>
          <p className="text-xs leading-[15px] text-body">
            <strong className="font-semibold text-primary-strong">Tranquilidad Garantizada:</strong>{" "}
            Técnicos verificados con cédula y antecedentes por la Policía Nacional.
          </p>
        </div>

        <p className="text-center text-xs text-muted">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="font-semibold text-primary-strong underline">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
