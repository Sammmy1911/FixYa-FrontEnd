import Link from "next/link";
import FigmaIcon from "@/components/ui/FigmaIcon";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-[12px] bg-primary text-white">
            <span className="material-symbols-outlined text-[18px]">handyman</span>
          </span>
          <span className="text-[22px] font-extrabold leading-7 tracking-[-0.55px] text-primary-strong">
            FixYa
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/#servicios"
            className="border-b-2 border-primary-strong pb-1.5 text-base font-bold text-primary-strong"
          >
            Servicios
          </Link>
          <Link href="/#como-funciona" className="text-base text-body hover:text-ink">
            Cómo funciona
          </Link>
          <Link href="/#para-tecnicos" className="text-base text-body hover:text-ink">
            Para técnicos
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/"
            aria-label="Soporte"
            className="hidden rounded-lg p-2 hover:bg-surface-low sm:flex"
          >
            <FigmaIcon name="a6a2f" width={20} height={18} />
          </a>
          <Link
            href="/auth/register"
            className="hidden rounded-[12px] border border-line px-4 py-2 text-base text-ink hover:bg-surface-low sm:block"
          >
            Soy técnico
          </Link>
          <Link
            href="/solicitar"
            className="flex items-center gap-1 rounded-[12px] bg-primary px-4 py-2 text-base font-semibold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:brightness-95 md:px-6"
          >
            Pedir servicio
            <FigmaIcon name="b0702" width={12} height={12} />
          </Link>
        </div>
      </div>
    </header>
  );
}
