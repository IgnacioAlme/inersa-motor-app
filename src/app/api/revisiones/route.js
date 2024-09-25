import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// Listar todas las revisiones
export async function GET(request) {
  const response = await prisma.revision.findMany();
  return NextResponse.json(response);
}

// Crear una revision
export async function POST(request) {
  const { vehiculoId, detalles, presupuesto, fecha } = await request.json();
  const response = await prisma.revision.create({
    data: {
      vehiculoId,
      detalles,
      presupuesto,
      fecha,
    },
  });

  return NextResponse.json(response);
}
