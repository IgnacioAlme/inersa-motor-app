import { useState, useEffect } from "react";

export default function ClientTable({ onDeleteClient }) {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleDeleteCliente = async (dni) => {
    const response = await fetch(`/api/clientes/${dni}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setClientes(clientes.filter((cliente) => cliente.dni !== dni));
      onDeleteClient(dni);
    } else {
      console.error("Error al eliminar cliente");
    }
  };

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
  );
}