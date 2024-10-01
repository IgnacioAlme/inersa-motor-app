import { useState, useEffect } from "react";
import Link from 'next/link';

export default function ClientTable({ clientes, onDeleteClient, onEditClient }) {
  return (
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
              <Link href={`/revisiones/crear/${cliente.dni}`} className="text-blue-600 hover:underline mr-2">
                Crear Revisión
              </Link>
              <button
                onClick={() => onEditClient(cliente)}
                className="text-yellow-600 hover:underline mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => onDeleteClient(cliente.dni)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}