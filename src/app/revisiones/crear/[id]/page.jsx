"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrearRevision({ params }) {
  const router = useRouter();
  const { clienteDni } = params;
  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState('');
  const [detalles, setDetalles] = useState('');
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  const [manoDeObra, setManoDeObra] = useState(0);
  const [presupuesto, setPresupuesto] = useState(0);
  const [filterCode, setFilterCode] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repuestosError, setRepuestosError] = useState(null);

  useEffect(() => {
    fetchClienteDetails();
    fetchRepuestos();
  }, [clienteDni]);

  useEffect(() => {
    calculatePresupuesto();
  }, [selectedRepuestos, manoDeObra]);

  const fetchClienteDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/clientes/${clienteDni}?includeVehicles=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      const data = await response.json();
      setCliente(data);
      setVehiculos(data.vehiculos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepuestos = async () => {
    try {
      const response = await fetch('/api/repuestos');
      if (!response.ok) {
        throw new Error('Failed to fetch repuestos');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        setRepuestosError('No hay repuestos disponibles');
      } else {
        setRepuestos(data);
      }
    } catch (err) {
      console.error('Error fetching repuestos:', err);
      setRepuestosError(err.message);
    }
  };

  const handleVehiculoChange = (e) => {
    setSelectedVehiculo(e.target.value);
  };

  const handleRepuestoToggle = (repuesto) => {
    setSelectedRepuestos(prev => 
      prev.some(r => r.id === repuesto.id)
        ? prev.filter(r => r.id !== repuesto.id)
        : [...prev, repuesto]
    );
  };

  const calculatePresupuesto = () => {
    const repuestosTotal = selectedRepuestos.reduce((sum, r) => sum + r.precio, 0);
    setPresupuesto(repuestosTotal + manoDeObra);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const revisionData = {
      vehiculoId: selectedVehiculo,
      detalles,
      presupuesto,
      fecha: new Date().toISOString(),
      repuestos: selectedRepuestos.map(r => r.id)
    };

    const response = await fetch('/api/revisiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revisionData),
    });

    if (response.ok) {
      router.push('/clientes');
    } else {
      // Handle error
    }
  };

  const filteredRepuestos = repuestos.filter(r => 
    (r.codigo.toLowerCase().includes(filterCode.toLowerCase()) || filterCode === '') &&
    (r.marca.toLowerCase().includes(filterMarca.toLowerCase()) || filterMarca === '') &&
    (r.tipo.toLowerCase().includes(filterTipo.toLowerCase()) || filterTipo === '') &&
    (r.marca_auto === 'UNIVERSAL' || (selectedVehiculo && vehiculos.length > 0 && r.marca_auto === vehiculos.find(v => v.id === selectedVehiculo)?.marca))
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cliente || vehiculos.length === 0) return <div>No client or vehicle data available.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Revisión para {cliente.nombre} {cliente.apellido}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Vehículo:</label>
          <select value={selectedVehiculo} onChange={handleVehiculoChange} className="w-full p-2 border rounded">
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map(v => (
              <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.matricula})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Detalles:</label>
          <textarea 
            value={detalles} 
            onChange={(e) => setDetalles(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Repuestos</h2>
          {repuestosError ? (
            <div className="text-red-500">{repuestosError}</div>
          ) : (
            <>
              <div className="flex space-x-2 mb-2">
                <input 
                  type="text" 
                  placeholder="Filtrar por código" 
                  value={filterCode} 
                  onChange={(e) => setFilterCode(e.target.value)}
                  className="p-2 border rounded"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por marca" 
                  value={filterMarca} 
                  onChange={(e) => setFilterMarca(e.target.value)}
                  className="p-2 border rounded"
                />
                <input 
                  type="text" 
                  placeholder="Filtrar por tipo" 
                  value={filterTipo} 
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              {filteredRepuestos.length > 0 ? (
                <table className="w-full border">
                  <thead>
                    <tr>
                      <th className="border p-2">Código</th>
                      <th className="border p-2">Marca</th>
                      <th className="border p-2">Tipo</th>
                      <th className="border p-2">Precio</th>
                      <th className="border p-2">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepuestos.map(r => (
                      <tr key={r.id}>
                        <td className="border p-2">{r.codigo}</td>
                        <td className="border p-2">{r.marca}</td>
                        <td className="border p-2">{r.tipo}</td>
                        <td className="border p-2">{r.precio}</td>
                        <td className="border p-2">
                          <button 
                            type="button"
                            onClick={() => handleRepuestoToggle(r)}
                            className={`px-2 py-1 rounded ${selectedRepuestos.some(sr => sr.id === r.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                          >
                            {selectedRepuestos.some(sr => sr.id === r.id) ? 'Quitar' : 'Agregar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No se encontraron repuestos que coincidan con los filtros.</div>
              )}
            </>
          )}
        </div>

        <div>
          <label className="block mb-2">Mano de Obra:</label>
          <input 
            type="number" 
            value={manoDeObra} 
            onChange={(e) => setManoDeObra(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">Presupuesto Total: {presupuesto}</h2>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Guardar Revisión
        </button>
      </form>
    </div>
  );
}