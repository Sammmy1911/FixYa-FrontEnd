'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService } from '../../../services/auth.service';
import { authButton, authInput, authLabel, getErrorMessage } from '../../../components/common/authStyles';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1); // Paso 1: Perfil, Paso 2: Formulario
  const [role, setRole] = useState<'CLIENT' | 'TECHNICIAN'>('CLIENT');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Plomería'); // Especialidad por defecto
  
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSelectRole = (selectedRole: 'CLIENT' | 'TECHNICIAN') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Creamos el payload enviando los campos comunes y agregando los de técnico si aplica
      const payload = {
        fullName,
        email,
        password,
        role,
        ...(role === 'TECHNICIAN' && { phone, specialty }),
      };

      await authService('auth/register', payload);

      // Redirigir al login tras el registro exitoso
      router.push('/auth/login');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? '¿Cómo deseas usar FixYa?' : `Registro de ${role === 'CLIENT' ? 'Cliente' : 'Técnico'}`}
      subtitle={step === 1 ? 'Selecciona el perfil con el que te registrarás en la plataforma.' : undefined}
      error={error}
    >
      {/* PASO 1: ELEGIR TIPO DE CUENTA */}
      {step === 1 && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleSelectRole('CLIENT')}
            className="group flex w-full items-center gap-4 rounded-[12px] border border-line bg-white p-4 text-left transition hover:border-primary hover:bg-surface-low"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-low text-primary-strong transition group-hover:bg-white">
              <span className="material-symbols-outlined text-[22px]">home</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">Soy Cliente</h3>
              <p className="text-xs leading-4 text-muted">Busco contratar servicios y reparaciones para el hogar.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('TECHNICIAN')}
            className="group flex w-full items-center gap-4 rounded-[12px] border border-line bg-white p-4 text-left transition hover:border-primary hover:bg-surface-low"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-low text-primary-strong transition group-hover:bg-white">
              <span className="material-symbols-outlined text-[22px]">handyman</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">Soy Técnico / Especialista</h3>
              <p className="text-xs leading-4 text-muted">Quiero ofrecer mis servicios y trabajar con clientes.</p>
            </div>
          </button>

          <div className="pt-4 text-center">
            <p className="text-sm text-muted">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="font-semibold text-primary-strong hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* PASO 2: FORMULARIO SEGÚN ROL */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-2 flex items-center gap-1 text-xs font-semibold text-primary-strong hover:underline"
          >
            ← Cambiar perfil ({role === 'CLIENT' ? 'Cliente' : 'Técnico'})
          </button>

          <div>
            <label className={authLabel}>Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={authInput}
              placeholder="Ej. Carlos Mendoza"
            />
          </div>

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

          {/* Campos exclusivos para Técnicos */}
          {role === 'TECHNICIAN' && (
            <>
              <div>
                <label className={authLabel}>Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={authInput}
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className={authLabel}>Especialidad Principal</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={authInput}
                >
                  <option value="Plomería">Plomería</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Cerrajería">Cerrajería</option>
                  <option value="Pintura y Remodelación">Pintura y Remodelación</option>
                  <option value="Aire Acondicionado">Aire Acondicionado</option>
                  <option value="Electrodomésticos">Electrodomésticos</option>
                </select>
              </div>
            </>
          )}

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
            Registrarse como {role === 'CLIENT' ? 'Cliente' : 'Técnico'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}