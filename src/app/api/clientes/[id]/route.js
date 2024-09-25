import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

// Actualizar un cliente
export async function PUT(request) {
  const { id } = await request.json();
  const response = await prisma.cliente.update({
    where: { dni: id },
    data: await request.json(),
  });

  return NextResponse.json(response);
}

// Eliminar un cliente
export async function DELETE(request) {
  const { id } = await request.json();
  const response = await prisma.cliente.delete({
    where: { dni: id },
  });

  return NextResponse.json(response);
}