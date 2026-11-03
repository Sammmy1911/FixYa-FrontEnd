export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Next.js + TypeScript + Tailwind CSS
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          ¡Tu proyecto está listo!
        </h1>

        <p className="mt-4 text-slate-300">
          Si ves este diseño, Tailwind CSS está funcionando correctamente.
        </p>

        <button
          className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          type="button"
        >
          Comenzar
        </button>
      </section>
    </main>
  );
}