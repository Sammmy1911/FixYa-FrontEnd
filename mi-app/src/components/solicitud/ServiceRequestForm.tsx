"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { createServiceRequest } from "@/lib/serviceRequests";
import type { Category } from "@/types/api";
import type { ServiceRequestData } from "@/types/service-request";

type Step = 1 | 2 | "done";
type Errors = Partial<Record<keyof ServiceRequestData, string>>;

const emptyData: ServiceRequestData = {
  categoryId: null,
  description: "",
  address: "",
  neighborhood: "",
  phone: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-cyan-500";

export default function ServiceRequestForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<ServiceRequestData>(emptyData);
  const [errors, setErrors] = useState<Errors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json() as Promise<Category[]>;
      })
      .then((list) => {
        if (active) setCategories(list);
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
  }, [reloadKey]);

  function retryCategories() {
    setCategoriesError(false);
    setLoadingCategories(true);
    setReloadKey((k) => k + 1);
  }

  function update<K extends keyof ServiceRequestData>(
    field: K,
    value: ServiceRequestData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep1(): boolean {
    const next: Errors = {};
    if (data.categoryId === null) next.categoryId = "Elige el tipo de servicio.";
    if (data.description.trim().length < 10)
      next.description = "Describe el problema con al menos 10 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStep2(): boolean {
    const next: Errors = {};
    if (data.address.trim().length < 5)
      next.address = "Escribe la dirección donde necesitas el servicio.";
    if (!/^3\d{9}$/.test(data.phone.replace(/\s/g, "")))
      next.phone = "Escribe un celular de 10 dígitos, por ejemplo 3001234567.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goToStep2() {
    if (validateStep1()) setStep(2);
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setSubmitting(true);
    try {
      await createServiceRequest({
        ...data,
        description: data.description.trim(),
        address: data.address.trim(),
        neighborhood: data.neighborhood.trim(),
        phone: data.phone.replace(/\s/g, ""),
      });
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setData(emptyData);
    setErrors({});
    setStep(1);
  }

  const selectedCategory = categories.find((c) => c.id === data.categoryId);

  if (step === "done") {
    return (
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">✅</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">¡Solicitud enviada!</h1>
        <p className="mt-2 text-slate-600">
          Buscaremos un técnico verificado de{" "}
          <strong>{selectedCategory?.name ?? "la categoría elegida"}</strong> para ti.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Hacer otra solicitud
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-cyan-600">Paso {step} de 2</p>
      <div className="mt-2 flex gap-2">
        <span className="h-1.5 flex-1 rounded-full bg-cyan-500" />
        <span
          className={`h-1.5 flex-1 rounded-full ${step === 2 ? "bg-cyan-500" : "bg-slate-200"}`}
        />
      </div>

      {step === 1 && (
        <div className="mt-6 space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">¿Qué necesitas?</h1>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Tipo de servicio</p>
            {loadingCategories && (
              <p className="text-sm text-slate-500">Cargando servicios...</p>
            )}
            {categoriesError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                No pudimos cargar los servicios.
                <button
                  type="button"
                  onClick={retryCategories}
                  className="ml-2 font-semibold underline"
                >
                  Reintentar
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update("categoryId", c.id)}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    data.categoryId === c.id
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {errors.categoryId && (
              <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
              Describe el problema
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={500}
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Ej: La llave del lavaplatos gotea y no cierra bien."
              className={inputClass}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-red-600">{errors.description}</span>
              <span className="text-slate-400">{data.description.length}/500</span>
            </div>
          </div>

          <button
            type="button"
            onClick={goToStep2}
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-5">
          <h1 className="text-2xl font-bold text-slate-900">¿Dónde estás?</h1>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
              Dirección
            </label>
            <input
              id="address"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Ej: Calle 5 # 38-25, apto 301"
              className={inputClass}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="neighborhood" className="mb-2 block text-sm font-medium text-slate-700">
              Barrio <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              id="neighborhood"
              value={data.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              placeholder="Ej: San Fernando"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
              Celular de contacto
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={12}
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="3001234567"
              className={inputClass}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Solicitar servicio"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
