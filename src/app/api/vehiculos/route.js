import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Listar todos los vehiculos
export async function GET(request) {
  const response = await prisma.vehiculo.findMany();
  return NextResponse.json(response);
}

// Crear un vehiculo
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received vehicle data:', data);

    // Validate required fields
    if (!data.matricula || !data.marca || !data.modelo || !data.anio || !data.clienteDni) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.vehiculo.create({
      data: {
        matricula: data.matricula,
        marca: data.marca,
        modelo: data.modelo,
        anio: parseInt(data.anio), // Ensure anio is an integer
        clienteDni: data.clienteDni,
      },
    });

    console.log('Created new vehicle:', newVehicle);

    return NextResponse.json({ message: "Vehículo añadido exitosamente", data: newVehicle });
  } catch (error) {
    console.error("Error al añadir vehículo:", error);
    return NextResponse.json(
      { error: "Error al añadir vehículo", details: error.message },
      { status: 500 }
    );
  }
}