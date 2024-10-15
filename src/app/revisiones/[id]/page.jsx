"use client";
import { TbFileTypePdf } from "react-icons/tb";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from "@/components/InvoicePDF";

export default function CrearRevision({ params }) {
  const router = useRouter();
  const { id: dni } = params;
  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState("");
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  const [detalles, setDetalles] = useState("");
  const [presupuestoAdicional, setPresupuestoAdicional] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    fetchClienteAndVehiculos();
    fetchRepuestos();
  }, [dni]);

  const fetchClienteAndVehiculos = async () => {
    const clienteResponse = await fetch(`/api/clientes/${dni}`);
    const clienteData = await clienteResponse.json();
    if (clienteData) {
      setCliente(clienteData);
      // Fetch vehicles for the client
      const vehiculosResponse = await fetch(`/api/vehiculos?clienteDni=${dni}`);
      if (vehiculosResponse.ok) {
        const vehiculosData = await vehiculosResponse.json();
        setVehiculos(vehiculosData);
      } else {
        console.error("Error fetching vehicles");
      }
    }
  };

  const fetchRepuestos = async () => {
    const response = await fetch("/api/repuestos");
    const data = await response.json();
    setRepuestos(data);
  };

  const handleRepuestoSelect = (repuesto) => {
    setSelectedRepuestos([...selectedRepuestos, repuesto]);
  };

  const handleRepuestoRemove = (codigo) => {
    setSelectedRepuestos(selectedRepuestos.filter((r) => r.codigo !== codigo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const totalPresupuesto =
      selectedRepuestos.reduce((sum, r) => sum + r.precio, 0) +
      Number(presupuestoAdicional);

    try {
      const response = await fetch("/api/revisiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detalles,
          presupuesto: totalPresupuesto,
          vehiculoId: selectedVehiculo,
          repuestos: selectedRepuestos,
        }),
      });

      if (response.ok) {
        const revisionData = await response.json();
        setSubmitMessage('Revisión creada exitosamente');
        
        // Prepare invoice data
        setInvoiceData({
          revisionId: revisionData.id,
          cliente: cliente,
          vehiculo: vehiculos.find(v => v.matricula === selectedVehiculo),
          repuestos: selectedRepuestos,
          detalles: detalles,
          presupuestoAdicional: Number(presupuestoAdicional),
          totalPresupuesto: totalPresupuesto,
          fecha: new Date().toLocaleDateString()
        });

        // Optionally reset form fields here
        setDetalles('');
        setSelectedVehiculo('');
        setSelectedRepuestos([]);
        setPresupuestoAdicional(0);
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Error al crear la revisión: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al crear la revisión:", error);
      setSubmitMessage('Error al crear la revisión. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRepuestos = repuestos.filter(
    (r) =>
      r.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.marca_auto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Crear Revisión para {cliente.nombre} {cliente.apellido}
      </h1>
      {submitMessage && (
        <div className={`p-4 mb-4 ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {submitMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Vehículo:</label>
          <select
            value={selectedVehiculo}
            onChange={(e) => setSelectedVehiculo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.matricula} value={v.matricula}>
                {v.marca} {v.modelo} - {v.matricula}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Detalles:</label>
          <textarea
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Presupuesto Adicional:</label>
          <input
            type="number"
            value={presupuestoAdicional}
            onChange={(e) => setPresupuestoAdicional(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Buscar Repuestos:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Buscar por tipo, marca o marca de auto"
          />
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Código</th>
                <th className="border p-2">Descripción</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepuestos.map((r) => (
                <tr key={r.codigo}>
                  <td className="border p-2">{r.codigo}</td>
                  <td className="border p-2">{r.descripcion}</td>
                  <td className="border p-2">{r.precio}</td>
                  <td className="border p-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleRepuestoSelect(r)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      <CiCirclePlus size={42}  />	
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Repuestos Seleccionados:</h3>
          <ul>
            {selectedRepuestos.map((r) => (
              <li
                key={r.codigo}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {r.descripcion} - {r.precio}
                </span>
                <button
                  type="button"
                  onClick={() => handleRepuestoRemove(r.codigo)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <CiCircleMinus size={42}  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Revisión'}
        </button>
      </form>

      {invoiceData && (
        <div className="mt-4">
          <PDFDownloadLink
            document={<InvoicePDF data={invoiceData} />}
            fileName={`invoice_${invoiceData.revisionId}.pdf`}
            className="bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                'Generando PDF...'
              ) : (
                <>
                  <TbFileTypePdf size={24} className="mr-2" />
                  Descargar Factura PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}
