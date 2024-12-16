"use client";

import { useState, useEffect, useCallback } from "react";
import { TbFileUpload } from "react-icons/tb";

function Repuestos() {
  const [repuestos, setRepuestos] = useState([]);
  const [filteredRepuestos, setFilteredRepuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [filters, setFilters] = useState({
    distribuidor: "",
    marca: "",
    marca_auto: "",
    tipo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Tamaño de página fijo

  useEffect(() => {
    fetchRepuestos();
  }, [currentPage, fetchRepuestos]);

  useEffect(() => {
    applyFilters();
  }, [repuestos, filters, applyFilters]);

  const fetchRepuestos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/repuestos?page=${currentPage}&pageSize=${pageSize}`);
      if (!response.ok) throw new Error("Failed to fetch repuestos");
      const data = await response.json();
      setRepuestos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setUploadStatus(null);
    try {
      const response = await fetch("/api/repuestos", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al cargar archivo");
      const result = await response.json();
      setUploadStatus(`Successfully processed ${result.count} records`);
      await fetchRepuestos(); // Refresh the table after successful upload
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = useCallback(() => {
    let filtered = repuestos;
    if (filters.distribuidor) {
      filtered = filtered.filter((r) =>
        r.distribuidor
          .toLowerCase()
          .includes(filters.distribuidor.toLowerCase())
      );
    }
    if (filters.marca) {
      filtered = filtered.filter((r) =>
        r.marca.toLowerCase().includes(filters.marca.toLowerCase())
      );
    }
    if (filters.marca_auto) {
      filtered = filtered.filter((r) =>
        r.marca_auto.toLowerCase().includes(filters.marca_auto.toLowerCase())
      );
    }
    if (filters.tipo) {
      filtered = filtered.filter((r) =>
        r.tipo.toLowerCase().includes(filters.tipo.toLowerCase())
      );
    }
    setFilteredRepuestos(filtered);
  });

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Repuestos</h1>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csvUpload"
        />
        <label
          htmlFor="csvUpload"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded cursor-pointer inline-flex items-center"
        >
          Cargar CSV
          <TbFileUpload size={24} className="ml-2" />
        </label>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {uploadStatus && <p className="text-green-500">{uploadStatus}</p>}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="distribuidor"
          placeholder="Filtrar por distribuidor"
          value={filters.distribuidor}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="marca"
          placeholder="Filtrar por marca"
          value={filters.marca}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="marca_auto"
          placeholder="Filtrar por marca auto"
          value={filters.marca_auto}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <select
          name="tipo"
          value={filters.tipo}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">Filtrar por tipo</option>
          <option value="ACEITE">ACEITES</option>
          <option value="ACEITES TRANSM. Y GRASAS">ACEITES TRANSM. Y GRASAS</option>
          <option value="LIQ. REFRIGERANTE Y ANTICONGEL.">LIQ. REFRIGERANTE Y ANTICONGEL.</option>
          <option value="LUBRICANTES Y ADITIVOS">LUBRICANTES Y ADITIVOS</option>
          <option value="FILTRO PACK">FILTRO PACK</option>
          <option value="FILTRO ACEITE">FILTRO ACEITE</option>
          <option value="FILTRO ANTIPOLEN P/CABINA">FILTRO ANTIPOLEN P/CABINA</option>
          <option value="FILTRO COMBUSTIBLE">FILTRO COMBUSTIBLE</option>
          <option value="FILTRO DE AIRE">FILTRO DE AIRE</option>
          <option value="FILTRO">FILTROS</option>
          <option value="GRASA">GRASA</option>
        </select>
      </div>

      {filteredRepuestos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Código</th>
                <th className="py-2 px-4 border-b">Distribuidor</th>
                <th className="py-2 px-4 border-b">Descripción</th>
                <th className="py-2 px-4 border-b">Marca</th>
                <th className="py-2 px-4 border-b">Tipo</th>
                <th className="py-2 px-4 border-b">Marca Auto</th>
                <th className="py-2 px-4 border-b">Precio</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepuestos.map((repuesto) => (
                <tr key={repuesto.codigo}>
                  <td className="py-2 px-4 border-b">{repuesto.codigo}</td>
                  <td className="py-2 px-4 border-b">
                    {repuesto.distribuidor}
                  </td>
                  <td className="py-2 px-4 border-b">{repuesto.descripcion}</td>
                  <td className="py-2 px-4 border-b">{repuesto.marca}</td>
                  <td className="py-2 px-4 border-b">{repuesto.tipo}</td>
                  <td className="py-2 px-4 border-b">{repuesto.marca_auto}</td>
                  <td className="py-2 px-4 border-b">{repuesto.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Anterior
        </button>
        <span>Página {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={filteredRepuestos.length < pageSize} // Desactivar si hay menos de pageSize elementos
          className={`bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded ${filteredRepuestos.length < pageSize ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Repuestos;