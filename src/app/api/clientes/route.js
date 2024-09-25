import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

// Listar todos los clientes
export async function GET(request) {
  const response = await prisma.cliente.findMany();
  return NextResponse.json(response);
}

// Crear un cliente
export async function POST(request) {
  const { dni, nombre, apellido, email, telefono, direccion } =
    await request.json();
  const response = await prisma.cliente.create({
    data: {
      dni,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
    },
  });

  return NextResponse.json(response);
}
