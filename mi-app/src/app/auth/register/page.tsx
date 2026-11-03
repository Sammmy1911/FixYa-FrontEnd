'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../../../components/common/AuthLayout';
import { authService } from '../../../services/auth.service';

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
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? '¿Cómo deseas usar FixYa?' : `Registro de ${role === 'CLIENT' ? 'Cliente' : 'Técnico'}`}
      error={error}
    >
      {/* PASO 1: ELEGIR TIPO DE CUENTA */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm text-center mb-6">
            Selecciona el perfil con el que te registrarás en la plataforma.
          </p>

          <button
            type="button"
            onClick={() => handleSelectRole('CLIENT')}
            className="w-full text-left p-4 rounded-xl border border-gray-700 bg-gray-800 hover:border-cyan-500 transition group flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">
              🏠
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Soy Cliente</h3>
              <p className="text-xs text-gray-400">Busco contratar servicios y reparaciones para el hogar.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('TECHNICIAN')}
            className="w-full text-left p-4 rounded-xl border border-gray-700 bg-gray-800 hover:border-amber-500 transition group flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">
              🛠️
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Soy Técnico / Especialista</h3>
              <p className="text-xs text-gray-400">Quiero ofrecer mis servicios y trabajar con clientes.</p>
            </div>
          </button>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-cyan-400 hover:underline font-semibold">
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
            className="text-xs text-cyan-400 hover:underline mb-2 flex items-center space-x-1"
          >
            ← Cambiar perfil ({role === 'CLIENT' ? 'Cliente' : 'Técnico'})
          </button>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej. Carlos Mendoza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Campos exclusivos para Técnicos */}
          {role === 'TECHNICIAN' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Especialidad Principal</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
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
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 font-bold rounded transition duration-200 text-white shadow-md ${
              role === 'CLIENT'
                ? 'bg-cyan-600 hover:bg-cyan-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            Registrarse como {role === 'CLIENT' ? 'Cliente' : 'Técnico'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}