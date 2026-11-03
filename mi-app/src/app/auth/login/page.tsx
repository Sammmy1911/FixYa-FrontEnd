'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService } from '../../../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authService('auth/login', { email, password });

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión - FixYa" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded transition duration-200"
        >
          Ingresar
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