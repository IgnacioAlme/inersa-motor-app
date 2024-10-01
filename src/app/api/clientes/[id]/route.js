import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Actualizar un cliente y añadir vehículo
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Start a transaction to ensure data consistency
    const updatedClient = await prisma.$transaction(async (prisma) => {
      // Update the client's basic information
      const updatedClientInfo = await prisma.cliente.update({
        where: { dni: id },
        data: {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          direccion: data.direccion,
        },
      });

      // Get existing vehicles
      const existingVehicles = await prisma.vehiculo.findMany({
        where: { clienteDni: id },
      });

      // Identify vehicles to delete, update, and create
      const vehiclesToDelete = existingVehicles.filter(
        (ev) => !data.vehiculo.some((v) => v.matricula === ev.matricula)
      );
      const vehiclesToUpdate = data.vehiculo.filter((v) =>
        existingVehicles.some((ev) => ev.matricula === v.matricula)
      );
      const vehiclesToCreate = data.vehiculo.filter(
        (v) => !existingVehicles.some((ev) => ev.matricula === v.matricula)
      );

      // Delete vehicles
      await prisma.vehiculo.deleteMany({
        where: {
          matricula: { in: vehiclesToDelete.map((v) => v.matricula) },
        },
      });

      // Update vehicles
      for (const vehicle of vehiclesToUpdate) {
        await prisma.vehiculo.update({
          where: { matricula: vehicle.matricula },
          data: {
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            anio: vehicle.anio,
          },
        });
      }

      // Create new vehicles
      await prisma.vehiculo.createMany({
        data: vehiclesToCreate.map((v) => ({
          ...v,
          clienteDni: id,
        })),
      });

      // Fetch the updated client with all vehicles
      return prisma.cliente.findUnique({
        where: { dni: id },
        include: { vehiculo: true },
      });
    });

    return NextResponse.json({ message: "Cliente actualizado exitosamente", data: updatedClient });
  } catch (error) {
    console.error("Error al actualizar cliente o gestionar vehículos:", error);
    return NextResponse.json(
      { error: "Error al actualizar cliente o gestionar vehículos", details: error.message },
      { status: 500 }
    );
  }
}


// Actualizar un cliente
/* export async function PUT(request, { params }) {
  const { id } = params;
  const response = await prisma.cliente.update({
    where: { dni: id },
    data: await request.json(),
  });

  return NextResponse.json(response);
} */

// Eliminar un cliente
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const response = await prisma.cliente.delete({
      where: { dni: id },
    });

    return NextResponse.json({ message: "Cliente eliminado exitosamente", data: response });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar cliente", details: error.message },
      { status: 500 }
    );
  }
}