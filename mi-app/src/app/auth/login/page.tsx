'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService, type LoginResponse } from '../../../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const data = await authService<LoginResponse>('auth/login', { email, password });

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.replace(data.user.role === 'technician' ? '/tecnico/solicitudes' : data.user.role === 'client' ? '/cliente/solicitudes' : '/admin/tecnicos');
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión - FixYa" error={error}>
      <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            id="login-email" autoComplete="email" type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            id="login-password" autoComplete="current-password" type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
            disabled={submitting}
            aria-busy={submitting}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded transition duration-200"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          ¿No tienes una cuenta?{' '}
          <Link href="/auth/register" className="text-blue-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}