"use client";

import { useState } from "react";
import AddClient from "@/components/client/AddClient";
import ClientTable from "@/components/client/ClientTable";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddCliente = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setShowPopup(false);
  };

  const handleDeleteCliente = () => {
    // This function can be used if you need to perform any actions
    // in the parent component after a client is deleted
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

      <ClientTable key={refreshKey} onDeleteClient={handleDeleteCliente} />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <AddClient
              onAddClient={handleAddCliente}
              onClose={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
