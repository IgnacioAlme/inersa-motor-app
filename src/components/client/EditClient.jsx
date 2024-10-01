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

  const addVehicle = () => {
    setVehicles([...vehicles, newVehicle]);
    setNewVehicle({ matricula: "", marca: "", modelo: "", anio: "" });
  };

  const removeVehicle = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedClient = { ...formData, vehiculo: vehicles };
    await onUpdateClient(updatedClient);
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
      <form onSubmit={handleSubmit}>
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
        {/* Add similar fields for apellido, email, telefono, direccion */}
        
        {/* Vehicles section */}
        <h3 className="text-xl font-bold mb-2">Vehículos</h3>
        {vehicles.map((vehicle, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <p>Matrícula: {vehicle.matricula}</p>
            <p>Marca: {vehicle.marca}</p>
            <p>Modelo: {vehicle.modelo}</p>
            <p>Año: {vehicle.anio}</p>
            <button
              type="button"
              onClick={() => removeVehicle(index)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        
        {/* New vehicle form */}
        <div className="mb-4">
          <h4 className="font-bold">Añadir nuevo vehículo</h4>
          <input
            type="text"
            name="matricula"
            value={newVehicle.matricula}
            onChange={handleVehicleChange}
            placeholder="Matrícula"
            className="w-full p-2 border rounded mb-2"
          />
          {/* Add similar inputs for marca, modelo, anio */}
          <button
            type="button"
            onClick={addVehicle}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Añadir Vehículo
          </button>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}