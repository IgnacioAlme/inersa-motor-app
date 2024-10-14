"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

function Informes() {
  // Ganancia por mes
  const [revenueData, setRevenueData] = useState([]);
  const [vehicleData, setVehicleData] = useState({
    totalVehicles: 0,
    vehiclesByMake: [],
    vehiclesByYear: [],
  });
  const [clientData, setClientData] = useState({
    totalClients: 0,
    newClientsLastMonth: 0,
    newClientsLastQuarter: 0,
    clientsWithMostVehicles: [],
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      const response = await fetch("/api/informes/financiero");
      const result = await response.json();
      const revenueData = result.revenueByMonth.map((item) => ({
        month: item.month,
        total_revenue: item.total_revenue,
      }));
      setRevenueData(revenueData);
    };

    const fetchVehicleData = async () => {
      const response = await fetch("/api/informes/vehiculos");
      const result = await response.json();
      setVehicleData({
        totalVehicles: result.totalVehicles,
        vehiclesByMake: result.resultTotalVehiclesByMake,
        vehiclesByYear: result.resultTotalVehiclesByYear,
      });
    };

    const fetchClientData = async () => {
      const response = await fetch("/api/informes/clientes");
      const result = await response.json();
      setClientData({
        totalClients: result.totalClients,
        newClientsLastMonth: result.newClientsLastMonth,
        newClientsLastQuarter: result.newClientsLastQuarter,
        clientsWithMostVehicles: result.clientsWithMostVehicles,
      });
    };

    fetchRevenueData();
    fetchVehicleData();
    fetchClientData();
  }, []);

  return (
    <div>
      {/* Client Summary Section */}
      <h2 className="text-3xl font-bold mb-4">Informes de clientes</h2>
      <div className="client-summary grid grid-cols-3 gap-4">
        <div className="card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total clientes</h2>
          <p className="text-2xl">{clientData.totalClients}</p>
        </div>
        <div className="card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Nuevos Clientes en Último Mes
          </h2>
          <p className="text-2xl">{clientData.newClientsLastMonth}</p>
        </div>
        <div className="card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Nuevos Clientes en Último Trimestre
          </h2>
          <p className="text-2xl">{clientData.newClientsLastQuarter}</p>
        </div>

        <div className="col-span-3">
          <h3 className="text-xl font-semibold mb-2">
            Top 5 Clientes con Más Vehículos
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left">
                    Nombre
                  </th>
                  <th className="border border-gray-300 p-2 text-left">DNI</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Vehicles
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientData.clientsWithMostVehicles.map((client) => (
                  <tr key={client.dni} className="border-b border-gray-200">
                    <td className="border border-gray-300 p-2">
                      {client.nombre} {client.apellido}
                    </td>
                    <td className="border border-gray-300 p-2">{client.dni}</td>
                    <td className="border border-gray-300 p-2">
                      {client.vehicleCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">Informes de vehículos</h2>

      <div className="flex">
        <div className="card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total de vehículos</h2>
          <p className="text-2xl">{vehicleData.totalVehicles}</p>
        </div>
        {/* Pie Chart for Vehicles by Make */}
        <div className="w-1/2 pr-2">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Vehículos por marca
          </h3>{" "}
          {/* Legend Title */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleData.vehiclesByMake}
                dataKey="totalVehicles"
                nameKey="marca"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name }) => name} // Custom label function to display make names
              >
                {vehicleData.vehiclesByMake.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart for Vehicles by Year */}
        <div className="w-1/2 pl-2">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Vehículos por año
          </h3>{" "}
          {/* Legend Title */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vehicleData.vehiclesByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anio" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalVehicles" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-4">Informes financieros</h2>

      {/* Line Chart for Revenue by Month */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_revenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Informes;
