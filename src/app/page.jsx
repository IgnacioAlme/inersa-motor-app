import Link from 'next/link';
import AppointmentCalendar from '../components/AppointmentCalendar';
import { FcBusinessman , FcList , FcAutomotive , FcComboChart  } from 'react-icons/fc'; // Importing icons

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Navegación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link legacyBehavior href="/clientes">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Clientes</h3>
                <p className="mt-2">Ver la lista de clientes</p>
              </div>
              <FcBusinessman size={56} /> {/* Icon added here */}
            </a>
          </Link>
          <Link legacyBehavior href="/repuestos"> 
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Repuestos</h3>
                <p className="mt-2">Ver la lista de repuestos</p>
              </div>
              <FcList size={56} /> {/* Icon added here */}
            </a>
          </Link>
          <Link legacyBehavior href="/vehiculos">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Vehículos</h3>
                <p className="mt-2">Ver la lista de vehículos</p>
              </div>
              <FcAutomotive size={56} /> {/* Icon added here */}
            </a>
          </Link>
          <Link legacyBehavior href="/informes">
            <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Informes</h3>
                <p className="mt-2">Acerca de últimas revisiones</p>
              </div>
              <FcComboChart size={56} /> {/* Icon added here */}
            </a>
          </Link>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Calendario de Citas</h2>
        <AppointmentCalendar />
      </main>
    </div>
  );
}
