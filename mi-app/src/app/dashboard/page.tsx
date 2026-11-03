'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* 1. NAVBAR / HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center shadow-md">
              <span className="text-xl">🛠️</span>
              <span className="ml-1.5 text-lg tracking-wide">FixYa</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#servicios" className="text-cyan-600 font-semibold hover:text-cyan-700 transition">
              Servicios
            </a>
            <a href="#como-funciona" className="hover:text-cyan-600 transition">
              Cómo funciona
            </a>
            <a href="#para-tecnicos" className="hover:text-cyan-600 transition">
              Para técnicos
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition px-3 py-2"
            >
              Soy técnico
            </Link>
            <Link
              href="/service-requests/new"
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md transition transform hover:-translate-y-0.5"
            >
              Pedir servicio →
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-3">
            <a href="#servicios" className="block text-gray-600 font-medium py-1">Servicios</a>
            <a href="#como-funciona" className="block text-gray-600 font-medium py-1">Cómo funciona</a>
            <a href="#para-tecnicos" className="block text-gray-600 font-medium py-1">Para técnicos</a>
            <div className="pt-2 flex flex-col space-y-2">
              <Link href="/auth/login" className="text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg">
                Soy técnico
              </Link>
              <Link href="/service-requests/new" className="text-center py-2 text-sm font-semibold text-white bg-cyan-500 rounded-lg shadow">
                Pedir servicio
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column (Text & CTAs) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span>🛡️ Servicio garantizado en Cali y Valle del Cauca</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Técnicos verificados a un clic de distancia
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Soluciona cualquier urgencia en tu hogar en minutos. Conectamos tu casa con profesionales inspeccionados y de total confianza, con tarifas justas y sin sorpresas en Cali.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              href="/service-requests/new"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 text-center transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Pedir servicio ahora</span>
              <span>⚡</span>
            </Link>
            <Link
              href="/auth/register"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3.5 rounded-xl text-center transition bg-white"
            >
              Soy técnico
            </Link>
          </div>

          {/* Rating stars */}
          <div className="flex items-center space-x-3 pt-4">
            <div className="flex text-amber-400 text-lg">
              ★★★★★
            </div>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">4.9/5 estrellas</strong> en más de 3.500 reseñas verificadas
            </p>
          </div>
        </div>

        {/* Right Column (Hero Card Illustration Simulation) */}
        <div className="lg:col-span-5 relative">
          <div className="bg-gray-100 rounded-3xl p-4 shadow-xl border border-gray-200 relative overflow-hidden group">
            {/* Simulated Image container */}
            <div className="h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-cyan-700/80 to-blue-900/90 relative flex items-end p-6">
              {/* Badge 1 */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-800 shadow flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Disponible ahora en Cali</span>
              </div>

              {/* Badge 2 */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-800 shadow flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Antecedentes y cédula verificados</span>
              </div>

              {/* Bottom widget inside image */}
              <div className="w-full bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tiempo promedio</p>
                  <p className="text-sm font-bold text-gray-900">Llegada a tu hogar: <span className="text-cyan-600">35 min</span></p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                  Urgencias
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* Stat 1 */}
          <div className="flex items-center space-x-4 pt-4 md:pt-0">
            <span className="text-4xl lg:text-5xl font-black text-cyan-600">+1.200</span>
            <div>
              <h3 className="font-bold text-gray-900">Técnicos verificados</h3>
              <p className="text-xs text-gray-500">Filtro de seguridad judicial, entrevista presencial y cédula validada.</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-8">
            <span className="text-4xl lg:text-5xl font-black text-cyan-600">+25.000</span>
            <div>
              <h3 className="font-bold text-gray-900">Servicios completados</h3>
              <p className="text-xs text-gray-500">98% de satisfacción garantizada en hogares y locales de la región.</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center space-x-4 pt-4 md:pt-0 md:pl-8">
            <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl text-2xl font-bold">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Póliza de cumplimiento</h3>
              <p className="text-xs text-gray-500">Todos los trabajos en FixYa cuentan con garantía de solución y cobertura ante imprevistos.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SERVICES CATEGORIES SECTION */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
            Cobertura especializada
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Nuestros servicios para el hogar
          </h2>
          <p className="text-sm text-gray-600">
            Mano de obra calificada y certificada para todo lo que tu casa necesita.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Plomería */}
          <div className="bg-white border border-gray-200 hover:border-cyan-500 rounded-3xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition">
              💧
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plomería</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Reparación de fugas, griferías, calentadores, destape de cañerías e instalaciones hidrosanitarias.
            </p>
            <Link
              href="/service-requests/new?category=plomeria"
              className="text-sm font-semibold text-cyan-600 group-hover:text-cyan-700 flex items-center space-x-1"
            >
              <span>Solicitar servicio</span>
              <span>→</span>
            </Link>
          </div>

          {/* Card 2: Electricidad */}
          <div className="bg-white border border-gray-200 hover:border-amber-500 rounded-3xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Electricidad</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Cortocircuitos, instalación de lámparas, tomas corrientes, tableros eléctricos y cableado.
            </p>
            <Link
              href="/service-requests/new?category=electricidad"
              className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center space-x-1"
            >
              <span>Solicitar servicio</span>
              <span>→</span>
            </Link>
          </div>

          {/* Card 3: Cerrajería */}
          <div className="bg-white border border-gray-200 hover:border-blue-500 rounded-3xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition">
              🔑
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cerrajería</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              Apertura de cerraduras de seguridad, cambio de guardas, instalación de cerrojos y duplicados.
            </p>
            <Link
              href="/service-requests/new?category=cerrajeria"
              className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Solicitar servicio</span>
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}