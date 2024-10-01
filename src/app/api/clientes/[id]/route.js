import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Actualizar un cliente y añadir vehículo
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedClient = await prisma.cliente.update({
      where: { dni: id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
      },
      include: { vehiculo: true }, // Include vehicles in the response
    });

    return NextResponse.json({ message: "Cliente actualizado exitosamente", data: updatedClient });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar cliente", details: error.message },
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

// GET route to fetch a single client with optional vehicle inclusion
export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const includeVehicles = searchParams.get('includeVehicles') === 'true';

  try {
    const client = await prisma.cliente.findUnique({
      where: { dni: id },
      include: includeVehicles ? { vehiculo: true } : undefined,
    });

    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Error fetching client' }, { status: 500 });
  }
}