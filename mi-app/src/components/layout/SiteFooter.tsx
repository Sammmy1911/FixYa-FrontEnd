import Link from "next/link";
import FigmaIcon from "@/components/ui/FigmaIcon";

const servicios = [
  "Plomería y tuberías",
  "Electricidad y cableado",
  "Cerrajería de seguridad",
  "Pintura y resanes",
  "Jardinería y zonas verdes",
  "Pañetes y enchapes",
];

const compania = [
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Para técnicos", href: "/#para-tecnicos" },
  { label: "Términos y condiciones", href: "#" },
  { label: "Política de privacidad", href: "#" },
  { label: "Cobertura en Cali y Colombia", href: "#" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-mid">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-8 border-b border-line/40 pb-6 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-[18px]">handyman</span>
              </span>
              <span className="text-[22px] font-extrabold leading-7 tracking-[-0.55px] text-primary-strong">
                FixYa
              </span>
            </div>
            <p className="max-w-[384px] pt-1 text-xs leading-4 text-body">
              La red más confiable de servicios para el hogar en Colombia. Conectando hogares con
              técnicos inspeccionados y de total confianza.
            </p>
            <p className="flex items-center gap-2 pt-3 text-xs font-semibold tracking-[0.24px] text-ink">
              <FigmaIcon name="5510d" width={12} height={15} />
              Cali, Jamundí, Yumbo y próximas ciudades
            </p>
          </div>

          <div className="flex flex-col gap-2 md:col-span-3">
            <h3 className="pb-1 text-lg font-semibold tracking-[-0.09px] text-ink">Servicios</h3>
            <ul className="flex flex-col gap-1">
              {servicios.map((s) => (
                <li key={s}>
                  <Link href="/solicitar" className="text-xs leading-4 text-body hover:text-ink">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <h3 className="pb-1 text-lg font-semibold tracking-[-0.09px] text-ink">Compañía</h3>
            <ul className="flex flex-col gap-1">
              {compania.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="text-xs leading-4 text-body hover:text-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 md:col-span-3">
            <h3 className="pb-1 text-lg font-semibold tracking-[-0.09px] text-ink">
              Centro de ayuda
            </h3>
            <p className="pb-1 text-xs leading-4 text-body">
              ¿Tienes dudas o necesitas atención personalizada para una urgencia?
            </p>
            <a
              href="https://wa.me/"
              className="flex w-fit items-center gap-1 rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-2 text-xs font-semibold tracking-[0.24px] text-[#047857]"
            >
              <FigmaIcon name="87ab4" width={15} height={15} />
              Atención por WhatsApp
            </a>
            <p className="pt-2 text-xs leading-4 text-body">soporte@fixya.com.co</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs leading-4 md:flex-row md:items-center md:justify-between">
          <p className="text-body">
            © 2025 FixYa Colombia S.A.S. Todos los derechos reservados. Servicios profesionales a
            domicilio verificados.
          </p>
          <p className="flex items-center gap-1 text-ink">
            Hecho en Colombia con amor y seguridad
            <FigmaIcon name="805e3" width={13.333} height={12.233} />
          </p>
        </div>
      </div>
    </footer>
  );
}
