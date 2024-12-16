"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vehiculos");
      if (!response.ok) throw new Error("Failed to fetch vehiculos");
      const data = await response.json();
      setVehiculos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedVehiculos = [...vehiculos].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehículos</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {sortedVehiculos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort("clienteDni")}
                >
                  DNI Cliente{" "}
                  {sortField === "clienteDni" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort("marca")}
                >
                  Marca{" "}
                  {sortField === "marca" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="py-2 px-4 border-b">Modelo</th>
                <th className="py-2 px-4 border-b">Año</th>
                <th className="py-2 px-4 border-b">Patente</th>
              </tr>
            </thead>
            <tbody>
              {sortedVehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td className="py-2 px-4 border-b">
                    <Link
                      href={`/clientes/${vehiculo.clienteDni}`}
                      className="text-blue-500 hover:underline"
                    >
                      {vehiculo.clienteDni}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{vehiculo.marca}</td>
                  <td className="py-2 px-4 border-b">{vehiculo.modelo}</td>
                  <td className="py-2 px-4 border-b">{vehiculo.anio}</td>
                  <td className="py-2 px-4 border-b">{vehiculo.matricula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Vehiculos;
