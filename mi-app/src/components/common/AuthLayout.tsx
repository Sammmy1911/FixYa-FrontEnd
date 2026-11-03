import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  error?: string;
  success?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, error, success, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/50 rounded border border-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-400 bg-green-900/50 rounded border border-green-700">
            {success}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}