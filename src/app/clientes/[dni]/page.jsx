'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientePage() {
  const { dni } = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client data
        const clientResponse = await fetch(`/api/clientes/${dni}`);
        const clientData = await clientResponse.json();
        setClient(clientData);

        // Fetch vehicles data
        const vehiclesResponse = await fetch('/api/vehiculos');
        const vehiclesData = await vehiclesResponse.json();
        const clientVehicles = vehiclesData.filter(vehicle => vehicle.clienteDni === dni);
        setVehicles(clientVehicles);

        // Fetch revisions data
        const revisionsPromises = clientVehicles.map(vehicle =>
          fetch(`/api/vehiculos/${vehicle.matricula}/revisiones`).then(res => res.json())
        );
        const allRevisions = await Promise.all(revisionsPromises);
        setRevisions(allRevisions.flat());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dni]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Detalles del Cliente</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex gap-6">
          {/* Left column: Client information */}
          <div className="w-1/3">
            <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
            <div className="mb-4">
              <p><strong>DNI:</strong> {client.dni}</p>
              <p><strong>Nombre:</strong> {client.nombre}</p>
              <p><strong>Apellido:</strong> {client.apellido}</p>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Teléfono:</strong> {client.telefono}</p>
              <p><strong>Dirección:</strong> {client.direccion}</p>
            </div>
          </div>

          {/* Middle column: List of vehicles */}
          <div className="w-1/3">
            <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
            <div className="mb-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <p><strong>Matrícula:</strong> {vehicle.matricula}</p>
                    <p><strong>Marca:</strong> {vehicle.marca}</p>
                    <p><strong>Modelo:</strong> {vehicle.modelo}</p>
                    <p><strong>Año:</strong> {vehicle.anio}</p>
                  </div>
                ))
              ) : (
                <p>No hay vehículos registrados para este cliente.</p>
              )}
            </div>
          </div>

          {/* Right column: List of revisions */}
          <div className="w-1/3">
            <h2 className="text-2xl font-bold mb-4">Revisiones</h2>
            <div className="mb-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {revisions.length > 0 ? (
                revisions.map((revision, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <p><strong>Fecha:</strong> {new Date(revision.fecha).toLocaleDateString()}</p>
                    <p><strong>Kilometraje:</strong> {revision.kilometraje}</p>
                    <p><strong>Descripción:</strong> {revision.descripcion}</p>
                  </div>
                ))
              ) : (
                <p>Sin revisiones</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            Volver
          </button>
          <Link 
            href={`/revisions/new?clientId=${client.dni}`}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Añadir Nueva Revisión
          </Link>
        </div>
      </div>
    </div>
  );
}