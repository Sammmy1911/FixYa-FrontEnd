/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FigmaIcon from "@/components/ui/FigmaIcon";

type Service = {
  name: string;
  description: string;
  badge: string;
  icon: { name: string; w: number; h: number };
  tone: string;
};

const services: Service[] = [
  {
    name: "Plomería",
    description:
      "Reparación de fugas, griferías, calentadores, destape de cañerías e instalaciones hidrosanitarias.",
    badge: "Desde $45.000 COP",
    icon: { name: "116fb", w: 18.667, h: 23.333 },
    tone: "bg-[#ecfeff] border-[#cffafe]",
  },
  {
    name: "Electricidad",
    description:
      "Cortocircuitos, instalación de lámparas, tomas corrientes, tableros eléctricos y cableado.",
    badge: "Desde $50.000 COP",
    icon: { name: "f3c36", w: 18.667, h: 23.333 },
    tone: "bg-[#fffbeb] border-[#fef3c7]",
  },
  {
    name: "Cerrajería",
    description:
      "Apertura de cerraduras de seguridad, cambio de guardas, instalación de cerrojos y duplicados.",
    badge: "Urgencias 24/7",
    icon: { name: "1bd97", w: 25.667, h: 14 },
    tone: "bg-[#f1f5f9] border-[#e2e8f0]",
  },
  {
    name: "Pintura",
    description:
      "Pintura de interiores y fachadas, resane de paredes, eliminación de humedades y acabados.",
    badge: "Cotización rápida",
    icon: { name: "33d55", w: 18.667, h: 22.167 },
    tone: "bg-[#eef2ff] border-[#e0e7ff]",
  },
  {
    name: "Jardinería",
    description:
      "Poda de césped, mantenimiento de jardines, control de plagas y paisajismo residencial.",
    badge: "Mantenimientos",
    icon: { name: "7648e", w: 23.333, h: 23.333 },
    tone: "bg-[#ecfdf5] border-[#d1fae5]",
  },
  {
    name: "Pañetes y enchapes",
    description:
      "Instalación de pisos cerámicos, porcelanato, enchape de baños, cocinas y revoque.",
    badge: "Acabados finos",
    icon: { name: "a7d62", w: 21, h: 21 },
    tone: "bg-[#fff7ed] border-[#ffedd5]",
  },
];

const steps = [
  {
    title: "Cuéntanos qué necesitas",
    text: "Describe el problema o arreglo y la dirección de tu hogar en Cali o sus alrededores.",
  },
  {
    title: "Te asignamos un técnico verificado",
    text: "Nuestro sistema selecciona al especialista disponible más cercano y calificado.",
  },
  {
    title: "El técnico acepta y va a tu casa",
    text: "Recibe la confirmación con foto y datos del técnico que llegará puntual a tu puerta.",
  },
  {
    title: "Califica el servicio",
    text: "Pagas de forma segura al finalizar y calificas la experiencia para mantener la calidad.",
  },
];

const benefits = [
  "Pagos semanales puntuales",
  "Tú eliges tus zonas de cobertura",
  "Sin costo de suscripción fija",
];

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto flex max-w-[672px] flex-col items-center gap-1 text-center">
      <p className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-primary-strong">
        {eyebrow}
      </p>
      <h2 className="text-[28px] font-bold leading-10 tracking-[-0.64px] text-ink md:text-[32px]">
        {title}
      </h2>
      <p className="text-sm leading-5 text-body">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-surface">
        {/* 2. Hero */}
        <section className="overflow-hidden border-b border-line/40 py-16">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-4 md:px-12 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-6 lg:col-span-7">
              <span className="flex items-center gap-2 rounded-full border border-line/60 bg-surface-mid px-4 py-2 text-xs font-semibold leading-4 tracking-[0.24px] text-primary-deep">
                <span className="text-base leading-4">🇨🇴</span>
                Servicio garantizado en Cali y Valle del Cauca
              </span>
              <div className="flex flex-col gap-3">
                <h1 className="text-[34px] font-extrabold leading-[42px] tracking-[-0.8px] text-ink md:text-[40px] md:leading-[48px]">
                  Técnicos verificados a un clic de distancia
                </h1>
                <p className="max-w-[576px] text-base leading-6 text-body">
                  Soluciona cualquier urgencia en tu hogar en minutos. Conectamos tu casa con
                  profesionales inspeccionados y de total confianza, con tarifas justas y sin
                  sorpresas en Cali.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/solicitar"
                  className="flex items-center gap-2 rounded-[12px] bg-primary px-8 py-4 text-sm font-semibold leading-5 tracking-[0.14px] text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:brightness-95"
                >
                  Pedir servicio ahora
                  <FigmaIcon name="13f9c" width={16} height={20} />
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-[12px] border border-line bg-white px-6 py-4 text-sm font-semibold leading-5 tracking-[0.14px] text-ink drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-surface-low"
                >
                  Soy técnico
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs leading-4">
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FigmaIcon key={i} name="0795f" width={16.667} height={15.833} />
                  ))}
                </span>
                <span className="font-semibold tracking-[0.24px] text-ink">4.9/5 estrellas</span>
                <span className="text-subtle">en más de 3.500 reseñas verificadas</span>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <div className="relative h-[460px] w-full max-w-[460px] overflow-hidden rounded-[24px] border border-line/60 bg-surface-mid shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] md:h-[522px]">
                <img
                  src="/figma/tecnico-hero.png"
                  alt="Técnico verificado de FixYa uniformado en un hogar en Cali, Colombia"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(33,49,69,0.6)] via-[rgba(33,49,69,0)] via-50% to-[rgba(33,49,69,0)]" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-line/40 bg-white/95 px-3 py-[7px] text-[11px] font-bold leading-[14px] tracking-[0.44px] text-ink shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[4px]">
                  <span className="size-2.5 rounded-full bg-[#10b981]" />
                  Disponible ahora en Cali
                </span>

                <div className="absolute right-4 top-16 flex max-w-[240px] items-start gap-2 rounded-2xl border border-line/80 bg-white/95 p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[12px]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#a7f3d0] bg-[#ecfdf5]">
                    <FigmaIcon name="55656" width={16.5} height={15.75} />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold leading-[13.75px] tracking-[0.44px] text-ink">
                      Antecedentes y cédula
                    </span>
                    <span className="block pt-0.5 text-xs leading-[15px] text-body">
                      Verificados por la Policía Nacional
                    </span>
                  </span>
                </div>

                <div className="absolute inset-x-4 bottom-6 flex items-center justify-between rounded-2xl border border-line/80 bg-white/95 p-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[12px]">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[12px] border border-[#fde68a] bg-[#fffbeb] text-[#d97706]">
                      <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                    </span>
                    <span>
                      <span className="block text-sm font-semibold leading-5 tracking-[0.14px] text-ink">
                        Tiempo promedio
                      </span>
                      <span className="block text-xs leading-4 text-body">
                        Llegada a tu hogar:{" "}
                        <strong className="font-bold text-primary-strong">35 min</strong>
                      </span>
                    </span>
                  </div>
                  <span className="rounded-lg bg-surface-mid px-2.5 py-1 text-[11px] font-bold leading-[14px] tracking-[0.44px] text-primary-deep">
                    Urgencias
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Indicadores de confianza */}
        <section className="border-b border-line/40 bg-white px-4 py-8 md:px-12">
          <div className="mx-auto grid max-w-[1184px] grid-cols-1 items-center gap-6 rounded-2xl border border-line/50 bg-surface-low p-8 md:grid-cols-12">
            <div className="flex items-center gap-4 md:col-span-4">
              <span className="text-[44px] font-extrabold leading-[52px] tracking-[-1.3px] text-primary md:text-[52px]">
                +1.200
              </span>
              <span>
                <span className="block text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
                  Técnicos verificados
                </span>
                <span className="block text-xs leading-4 text-body">
                  Filtro de seguridad judicial, entrevista presencial y cédula validada.
                </span>
              </span>
            </div>
            <div className="hidden justify-center md:col-span-1 md:flex">
              <span className="h-16 w-px bg-line/60" />
            </div>
            <div className="flex items-center gap-4 md:col-span-4">
              <span className="text-[44px] font-extrabold leading-[52px] tracking-[-1.3px] text-primary md:text-[52px]">
                +25.000
              </span>
              <span>
                <span className="block text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
                  Servicios completados
                </span>
                <span className="block text-xs leading-4 text-body">
                  98% de satisfacción garantizada en hogares y locales de la región.
                </span>
              </span>
            </div>
            <div className="flex flex-col justify-center border-line/50 md:col-span-3 md:border-l md:pl-6">
              <span className="flex items-center gap-1 text-xs font-semibold leading-4 tracking-[0.24px] text-primary-strong">
                <FigmaIcon name="306c8" width={12} height={15} />
                Póliza de cumplimiento
              </span>
              <span className="pt-1 text-xs leading-4 text-body">
                Todos los trabajos en FixYa cuentan con garantía de solución y cobertura ante
                imprevistos.
              </span>
            </div>
          </div>
        </section>

        {/* 4. Servicios */}
        <section id="servicios" className="scroll-mt-20 py-16">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 md:px-12">
            <SectionHeader
              eyebrow="Cobertura especializada"
              title="Nuestros servicios para el hogar"
              text="Mano de obra calificada y certificada para todo lo que tu casa necesite."
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.name}
                  className="flex flex-col justify-between gap-[22.75px] rounded-2xl border border-line/60 bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col gap-[7px] pb-4">
                    <span
                      className={`flex size-14 items-center justify-center rounded-2xl border ${s.tone}`}
                    >
                      <FigmaIcon name={s.icon.name} width={s.icon.w} height={s.icon.h} />
                    </span>
                    <h3 className="pt-2 text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
                      {s.name}
                    </h3>
                    <p className="text-sm leading-[22.75px] text-body">{s.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-line/30 pt-3">
                    <span className="rounded bg-surface-mid px-2 py-0.5 text-[11px] font-bold leading-[14px] tracking-[0.44px] text-primary-strong">
                      {s.badge}
                    </span>
                    <Link
                      href={`/solicitar?categoria=${encodeURIComponent(s.name)}`}
                      className="flex items-center gap-1 text-xs font-semibold leading-4 tracking-[0.24px] text-primary-strong hover:underline"
                    >
                      Solicitar este servicio
                      <FigmaIcon name="88531" width={10.667} height={10.667} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Cómo funciona */}
        <section
          id="como-funciona"
          className="scroll-mt-20 border-y border-line/40 bg-white py-16"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 md:px-12">
            <SectionHeader
              eyebrow="Proceso transparente"
              title="¿Cómo funciona FixYa?"
              text="Pedir un técnico a domicilio nunca había sido tan fácil y seguro."
            />
            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col items-start rounded-2xl border border-line/40 bg-surface p-4 pb-10"
                >
                  <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                    {i + 1}
                  </span>
                  <h3 className="pb-2 text-lg font-semibold leading-6 tracking-[-0.09px] text-ink">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-5 text-body">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Para técnicos */}
        <section id="para-tecnicos" className="scroll-mt-20 px-4 py-16 md:px-12">
          <div
            className="relative mx-auto max-w-[1184px] overflow-hidden rounded-[24px] border border-line/20 p-8 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] md:p-16"
            style={{
              backgroundImage:
                "linear-gradient(161.5deg, rgb(33, 49, 69) 0%, rgb(27, 43, 63) 50%, rgb(12, 26, 41) 100%)",
            }}
          >
            <div className="pointer-events-none absolute -bottom-20 -right-20 size-96 rounded-full bg-primary/10 blur-[64px]" />
            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="flex flex-col items-start gap-4 lg:col-span-8">
                <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-[11px] font-bold leading-[14px] tracking-[0.44px] text-[#4cd7f6]">
                  <FigmaIcon name="f8958" width={14.6} height={12} />
                  Comunidad de técnicos en Colombia
                </span>
                <h2 className="text-[28px] font-bold leading-10 tracking-[-0.64px] text-white md:text-[32px]">
                  ¿Eres especialista y buscas más clientes? Únete a FixYa
                </h2>
                <p className="max-w-[672px] text-base leading-6 text-surface-mid">
                  Aumenta tus ingresos trabajando con horarios flexibles. Te invitamos a registrarte
                  y subir tus documentos (cédula, antecedentes y certificaciones) para ser
                  verificado y empezar a recibir solicitudes en tu zona.
                </p>
                <ul className="grid w-full grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 py-1">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/30">
                        <FigmaIcon name="59f32" width={10.867} height={8.017} />
                      </span>
                      <span className="text-xs font-semibold leading-4 tracking-[0.24px] text-white">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-start lg:col-span-4 lg:items-end">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 rounded-[12px] bg-primary px-8 py-4 text-sm font-bold leading-5 tracking-[0.14px] text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:brightness-95"
                >
                  Registrarme como técnico
                  <FigmaIcon name="d3302" width={16} height={16} />
                </Link>
                <p className="pt-2 text-xs leading-4 text-[rgba(211,228,254,0.8)] lg:text-right">
                  Revisión de documentos en menos de 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
