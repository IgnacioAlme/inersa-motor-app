import { useState, useEffect } from "react";

export default function EditClient({ client, onUpdateClient, onClose }) {
  const [formData, setFormData] = useState(client);
  const [vehicles, setVehicles] = useState(client.vehiculo || []);
  const [newVehicle, setNewVehicle] = useState({ matricula: "", marca: "", modelo: "", anio: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const addVehicle = async () => {
    if (!newVehicle.matricula || !newVehicle.marca || !newVehicle.modelo || !newVehicle.anio) {
      alert("Por favor, complete todos los campos del vehículo.");
      return;
    }

    try {
      const response = await fetch('/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newVehicle,
          anio: parseInt(newVehicle.anio), // Ensure anio is sent as a number
          clienteDni: formData.dni
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add vehicle');
      }

      const result = await response.json();
      setVehicles([...vehicles, result.data]);
      setNewVehicle({ matricula: "", marca: "", modelo: "", anio: "" });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(error.message || 'Error adding vehicle. Please try again.');
    }
  };

  const removeVehicle = async (matricula) => {
    try {
      const response = await fetch(`/api/vehiculos/${matricula}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      setVehicles(vehicles.filter(v => v.matricula !== matricula));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error deleting vehicle. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/clientes/${formData.dni}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      const result = await response.json();
      setFormData(result.data);
      setVehicles(result.data.vehiculos);
      onUpdateClient(result.data);
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg mx-auto" style={{ maxWidth: "80%" }}>
      <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-6 mb-6">
          {/* Left column: Client information */}
          <div className="w-1/3">
            <h3 className="text-xl font-bold mb-2">Información del Cliente</h3>
            <div className="mb-4">
              <label className="block mb-2">DNI:</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            {/* Client information fields */}
            <div className="mb-4">
              <label className="block mb-2">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Add other client fields here */}
            <div className="mb-4">
              <label className="block mb-2">Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Middle column: List of vehicles */}
          <div className="w-1/3">
            <h3 className="text-xl font-bold mb-2">Vehículos</h3>
            <div className="mb-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {vehicles.map((vehicle, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <p>Matrícula: {vehicle.matricula}</p>
                  <p>Marca: {vehicle.marca}</p>
                  <p>Modelo: {vehicle.modelo}</p>
                  <p>Año: {vehicle.anio}</p>
                  <button
                    type="button"
                    onClick={() => removeVehicle(vehicle.matricula)}
                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Add new vehicle form */}
          <div className="w-1/3">
            <h3 className="text-xl font-bold mb-2">Añadir Vehículo</h3>
            <div className="mb-4">
              <div className="mb-2">
                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matrícula:</label>
                <input
                  id="matricula"
                  type="text"
                  name="matricula"
                  value={newVehicle.matricula}
                  onChange={handleVehicleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              {/* Add other vehicle fields here */}
              <div className="mb-2">
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca:</label>
                <input
                  id="marca"
                  type="text"
                  name="marca"
                  value={newVehicle.marca}
                  onChange={handleVehicleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo:</label>
                <input
                  id="modelo"
                  type="text"
                  name="modelo"
                  value={newVehicle.modelo}
                  onChange={handleVehicleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="anio" className="block text-sm font-medium text-gray-700">Año:</label>
                <input
                  id="anio"
                  type="number"
                  name="anio"
                  value={newVehicle.anio}
                  onChange={handleVehicleChange}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <button
                type="button"
                onClick={addVehicle}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Añadir Vehículo
              </button>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}