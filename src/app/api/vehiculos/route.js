import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// Listar todos los vehiculos
export async function GET(request) {
  const response = await prisma.vehiculo.findMany();
  return NextResponse.json(response);
}

// Crear un vehiculo
export async function POST(request) {
  const { matricula, marca, modelo, anio, clienteDni, revision } =
    await request.json();
  const response = await prisma.vehiculo.create({
    data: {
      matricula,
      marca,
      modelo,
      anio,
      clienteDni,
      revision: {
        create: revision,
      },
    },
  });

  return NextResponse.json(response);
}