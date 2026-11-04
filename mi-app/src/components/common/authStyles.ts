export const authLabel = 'mb-1 block text-sm font-semibold leading-5 tracking-[0.14px] text-ink';

export const authInput =
  'h-12 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20';

export const authButton =
  'flex h-12 w-full items-center justify-center rounded-[12px] bg-primary text-sm font-semibold tracking-[0.14px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:brightness-95';

export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error en la petición';
}
