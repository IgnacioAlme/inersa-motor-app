import { useState, useEffect } from "react";

export default function EditClient({ client, onUpdateClient, onClose }) {
  const [formData, setFormData] = useState(client);
  const [vehicles, setVehicles] = useState(
    (client.vehiculo || []).map(v => ({ ...v, status: 'unchanged' }))
  );
  const [newVehicle, setNewVehicle] = useState({ matricula: "", marca: "", modelo: "", anio: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const addVehicle = () => {
    if (!newVehicle.matricula || !newVehicle.marca || !newVehicle.modelo || !newVehicle.anio) {
      alert("Por favor, complete todos los campos del vehículo.");
      return;
    }
    setVehicles([...vehicles, { ...newVehicle, status: 'new' }]);
    setNewVehicle({ matricula: "", marca: "", modelo: "", anio: "" });
  };

  const removeVehicle = (index) => {
    setVehicles(vehicles.map((v, i) => 
      i === index 
        ? v.status === 'new' 
          ? null 
          : { ...v, status: 'deleted' }
        : v
    ).filter(Boolean));
  };

  const updateVehicle = (index, field, value) => {
    setVehicles(vehicles.map((v, i) => 
      i === index 
        ? { ...v, [field]: value, status: v.status === 'new' ? 'new' : 'modified' }
        : v
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update client information
    await onUpdateClient({ ...formData, vehiculo: vehicles });

    // Handle vehicle updates
    for (const vehicle of vehicles) {
      if (vehicle.status === 'new') {
        // Add new vehicle
        try {
          const response = await fetch('/api/vehiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...vehicle, clienteDni: formData.dni }),
          });
          const result = await response.json();
          console.log('New vehicle response:', result);
          if (!response.ok) {
            throw new Error(result.error || 'Failed to add vehicle');
          }
        } catch (error) {
          console.error('Error adding vehicle:', error);
          // You might want to show an error message to the user here
        }
      } else if (vehicle.status === 'deleted') {
        // Delete vehicle
        await fetch(`/api/vehiculos/${vehicle.matricula}`, { method: 'DELETE' });
      } else if (vehicle.status === 'modified') {
        // Update vehicle
        await fetch(`/api/vehiculos/${vehicle.matricula}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle),
        });
      }
    }

    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-6 mb-6">
          {/* Left column: Client information */}
          <div className="w-1/3">
            <h3 className="text-xl font-bold mb-2">Información del Cliente</h3>
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
                  <input
                    type="text"
                    value={vehicle.matricula}
                    onChange={(e) => updateVehicle(index, 'matricula', e.target.value)}
                    className="w-full p-1 mb-1 border rounded"
                    disabled={vehicle.status === 'deleted'}
                  />
                  <input
                    type="text"
                    value={vehicle.marca}
                    onChange={(e) => updateVehicle(index, 'marca', e.target.value)}
                    className="w-full p-1 mb-1 border rounded"
                    disabled={vehicle.status === 'deleted'}
                  />
                  <input
                    type="text"
                    value={vehicle.modelo}
                    onChange={(e) => updateVehicle(index, 'modelo', e.target.value)}
                    className="w-full p-1 mb-1 border rounded"
                    disabled={vehicle.status === 'deleted'}
                  />
                  <input
                    type="number"
                    value={vehicle.anio}
                    onChange={(e) => updateVehicle(index, 'anio', e.target.value)}
                    className="w-full p-1 mb-1 border rounded"
                    disabled={vehicle.status === 'deleted'}
                  />
                  <button
                    type="button"
                    onClick={() => removeVehicle(index)}
                    className={`mt-2 px-2 py-1 ${
                      vehicle.status === 'deleted' ? 'bg-green-500' : 'bg-red-500'
                    } text-white rounded`}
                  >
                    {vehicle.status === 'deleted' ? 'Restaurar' : 'Eliminar'}
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
              <div className="mb-2">
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca:</label>
                <input
                  id="marca"
                  type="text"
                  name="marca"
                  value={newVehicle.marca}
                  onChange={handleVehicleChange}
                  placeholder="Marca"
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
                  placeholder="Modelo"
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
                  placeholder="Año"
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