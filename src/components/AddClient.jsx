"use client";

import { useState } from "react";

export default function AddClient({ onAddClient, onClose }) {
  const [nuevoCliente, setNuevoCliente] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [dniError, setDniError] = useState("");

  const handleAddCliente = async () => {
    if (!nuevoCliente.dni.trim()) {
      setDniError("El DNI es obligatorio");
      return;
    }

    const response = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoCliente),
    });

    if (response.ok) {
      const nuevo = await response.json();
      onAddClient(nuevo);
      setNuevoCliente({
        dni: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
      });
      onClose();
    } else {
      console.error("Error al agregar cliente");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Cliente</h2>
        <div className="mb-4">
          <label className="block mb-1">DNI</label>
          <input
            type="number"
            required
            value={nuevoCliente.dni}
            onChange={(e) => {
              setNuevoCliente({ ...nuevoCliente, dni: e.target.value });
              setDniError("");
            }}
            className={`border ${dniError ? 'border-red-500' : 'border-gray-300'} p-2 rounded w-full`}
          />
          {dniError && <p className="text-red-500 text-sm mt-1">{dniError}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Apellido</label>
          <input
            type="text"
            value={nuevoCliente.apellido}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={nuevoCliente.email}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Teléfono</label>
          <input
            type="tel"
            value={nuevoCliente.telefono}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Dirección</label>
          <input
            type="text"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
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
  );
}