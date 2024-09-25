// pages/index.jsx

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="bg-blue-600 w-full p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Gestión de Repuestos y Clientes</h1>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Navegación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link legacyBehavior href="/clientes">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Clientes</h3>
              <p className="mt-2">Ver la lista de clientes</p>
            </a>
          </Link>
          <Link legacyBehavior href="/repuestos">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Repuestos</h3>
              <p className="mt-2">Ver la lista de repuestos</p>
            </a>
          </Link>
          <Link legacyBehavior href="/vehiculos">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Vehículos</h3>
              <p className="mt-2">Ver la lista de vehículos</p>
            </a>
          </Link>
          <Link legacyBehavior href="/revisiones">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Revisiones</h3>
              <p className="mt-2">Ver la lista de revisiones</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
