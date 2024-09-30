"use client";
import Link from "next/link";

// Revisar por qué no funciona

import { useState, useEffect } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Función para obtener la lista de clientes de la API
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleDeleteCliente = async (dni) => {
    // Lógica para eliminar un cliente
    const response = await fetch(`/api/clientes/${dni}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setClientes(clientes.filter((cliente) => cliente.dni !== dni));
    } else {
      // Manejo de errores
      console.error("Error al eliminar cliente");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      <Link
        href="/clientes/nuevo"
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Crear Nuevo Cliente
      </Link>

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
          {clientes.map((cliente) => (
            <tr key={cliente.dni}>
              <td className="py-2 px-4 border-b">{cliente.dni}</td>
              <td className="py-2 px-4 border-b">{cliente.nombre}</td>
              <td className="py-2 px-4 border-b">{cliente.apellido}</td>
              <td className="py-2 px-4 border-b">{cliente.email}</td>
              <td className="py-2 px-4 border-b">{cliente.telefono}</td>
              <td className="py-2 px-4 border-b">{cliente.direccion}</td>
              <td className="py-2 px-4 border-b">
                <button className="text-blue-600 hover:underline mr-2">
                  Crear Revisión
                </button>
                <button className="text-yellow-600 hover:underline mr-2">
                  Editar
                </button>
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
    </div>
  );
}
