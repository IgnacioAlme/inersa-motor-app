"use client";

import { useState, useEffect } from "react";
import AddClient from "@/components/client/AddClient";
import ClientTable from "@/components/client/ClientTable";
import EditClient from "@/components/client/EditClient";

export default function Clientes() {
  const [showPopup, setShowPopup] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clientes");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCliente = (newCliente) => {
    setClientes(prevClientes => [...prevClientes, newCliente]);
    setShowPopup(false);
  };

  const handleDeleteCliente = async (dni) => {
    try {
      const response = await fetch(`/api/clientes/${dni}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete client. Status: ${response.status}`);
      }
      
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.dni !== dni));
    } catch (err) {
      console.error("Error deleting client:", err);
      setError(err.message);
      // Optionally, you can set a timeout to clear the error after a few seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      const response = await fetch(`/api/clientes/${updatedClient.dni}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update client. Status: ${response.status}`);
      }

      const updatedData = await response.json();
      setClientes(prevClientes =>
        prevClientes.map(cliente =>
          cliente.dni === updatedClient.dni ? updatedData.data : cliente
        )
      );
      setEditingClient(null);
    } catch (err) {
      console.error("Error updating client:", err);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <button
        onClick={() => setShowPopup(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Crear Nuevo Cliente
      </button>

      <ClientTable
        clientes={clientes}
        onDeleteClient={handleDeleteCliente}
        onEditClient={handleEditClient}
      />

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

      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <EditClient
              client={editingClient}
              onUpdateClient={handleUpdateClient}
              onClose={() => setEditingClient(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
