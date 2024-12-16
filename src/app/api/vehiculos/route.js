import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Listar todos los vehiculos o vehiculos de un cliente específico
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteDni = searchParams.get('clienteDni');

    let vehiculos;

    if (clienteDni) {
      // Fetch vehicles for a specific client
      vehiculos = await prisma.vehiculo.findMany({
        where: {
          clienteDni: clienteDni
        }
      });
    } else {
      // Fetch all vehicles
      vehiculos = await prisma.vehiculo.findMany();
    }

    return NextResponse.json(vehiculos);
  } catch (error) {
    console.error("Error fetching vehiculos:", error);
    return NextResponse.json(
      { error: "Error fetching vehiculos" },
      { status: 500 }
    );
  }
}

// Crear un vehiculo
export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received vehicle data:", data);

    // Validate required fields
    if (
      !data.matricula ||
      !data.marca ||
      !data.modelo ||
      !data.anio ||
      !data.clienteDni
    ) {
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
        cliente: {
          connect: { dni: data.clienteDni },
        },
      },
      include: { cliente: true },
    });

    console.log("Created new vehicle:", newVehicle);

    return NextResponse.json({
      message: "Vehículo añadido exitosamente",
      data: newVehicle,
    });
  } catch (error) {
    console.error("Error al añadir vehículo:", error);
    return NextResponse.json(
      { error: "Error al añadir vehículo", details: error.message },
      { status: 500 }
    );
  }
}
