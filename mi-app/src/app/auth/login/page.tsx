'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService } from '../../../services/auth.service';
import { authButton, authInput, authLabel, getErrorMessage } from '../../../components/common/authStyles';

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
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Ingresa a tu cuenta de FixYa." error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={authLabel}>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={authInput}
            placeholder="tu@correo.com"
          />
        </div>

        <div>
          <label className={authLabel}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={authInput}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className={authButton}
        >
          Ingresar
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          ¿No tienes una cuenta?{' '}
          <Link href="/auth/register" className="font-semibold text-primary-strong hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}