import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

// Ver una revision
export async function GET(request, { params }) {
  const { id } = params.id;
  const response = await prisma.revision.findUnique({
    where: { id },
  });
  return NextResponse.json(response);
}

// Actualizar una revision
export async function PUT(request) {
  const { id } = await request.json();
  const response = await prisma.revision.update({
    where: { id },
    data: await request.json(),
  });

  return NextResponse.json(response);
}

// Eliminar una revision
export async function DELETE(request) {
  const { id } = await request.json();
  const response = await prisma.revision.delete({
    where: { id },
  });

  return NextResponse.json(response);
}

