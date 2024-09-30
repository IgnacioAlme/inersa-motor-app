"use client"

// Revisar por qué no funciona

import { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    // Función para obtener la lista de clientes de la API
    const fetchClientes = async () => {
      const response = await fetch('/api/clientes');
      const data = await response.json();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleAddCliente = async () => {
    // Lógica para agregar un nuevo cliente
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoCliente),
    });

    if (response.ok) {
      const nuevo = await response.json();
      setClientes([...clientes, nuevo]);
      setNuevoCliente({ dni: '', nombre: '', apellido: '', email: '', telefono: '', direccion: '' });
      setShowPopup(false);
    } else {
      // Manejo de errores
      console.error('Error al agregar cliente');
    }
  };

  const handleDeleteCliente = async (dni) => {
    // Lógica para eliminar un cliente
    const response = await fetch(`/api/clientes/${dni}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setClientes(clientes.filter(cliente => cliente.dni !== dni));
    } else {
      // Manejo de errores
      console.error('Error al eliminar cliente');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <button
        onClick={() => setShowPopup(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Crear Nuevo Cliente
      </button>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">DNI</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Apellido</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Dirección</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.dni}>
              <td className="py-2 px-4 border-b">{cliente.dni}</td>
              <td className="py-2 px-4 border-b">{cliente.nombre}</td>
              <td className="py-2 px-4 border-b">{cliente.apellido}</td>
              <td className="py-2 px-4 border-b">{cliente.email}</td>
              <td className="py-2 px-4 border-b">{cliente.telefono}</td>
              <td className="py-2 px-4 border-b">{cliente.direccion}</td>
              <td className="py-2 px-4 border-b">
                <button className="text-blue-600 hover:underline mr-2">Crear Revisión</button>
                <button className="text-yellow-600 hover:underline mr-2">Editar</button>
                <button
                  onClick={() => handleDeleteCliente(cliente.dni)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Cliente</h2>
            <div className="mb-4">
              <label className="block mb-1">DNI</label>
              <input
                type="number"
                value={nuevoCliente.dni}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, dni: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Nombre</label>
              <input
                type="text"
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Apellido</label>
              <input
                type="text"
                value={nuevoCliente.apellido}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Teléfono</label>
              <input
                type="tel"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Dirección</label>
              <input
                type="text"
                value={nuevoCliente.direccion}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCliente}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Agregar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}