'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService } from '../../../services/auth.service';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService('auth/register', { fullName, email, password });

      // Redirigir al login tras un registro exitoso
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Crear Cuenta - FixYa" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Tu Nombre"
          />
        </div>

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
          Registrarse
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}