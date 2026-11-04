import React, { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  error?: string;
  success?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, error, success, children }: AuthLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-[12px] border border-line bg-white p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06),0px_2px_6px_-1px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-[-0.48px] text-ink">{title}</h1>
            {subtitle && <p className="text-sm leading-5 text-muted">{subtitle}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] p-3 text-sm text-[#047857]">
              {success}
            </div>
          )}

          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
