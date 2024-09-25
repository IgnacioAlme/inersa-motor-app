import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

// Ver un vehiculo
export async function GET(request, { params }) {
  const { id } = params.id;
  const response = await prisma.vehiculo.findUnique({
    where: { matricula: id },
  });
  return NextResponse.json(response);
}

// Actualizar un vehiculo
export async function PUT(request) {
  const { id } = await request.json();
  const response = await prisma.vehiculo.update({
    where: { matricula: id },
    data: await request.json(),
  });

  return NextResponse.json(response);
}

// Eliminar un vehiculo
export async function DELETE(request) {
  const { id } = await request.json();
  const response = await prisma.vehiculo.delete({
    where: { matricula: id },
  });

  return NextResponse.json(response);
}




// Ver revisiones de un vehiculo

// export async function GET(request, {params}) {
//   const { id } = params.id;
//   const response = await prisma.revision.findMany({
//     where: { vehiculoId: id },
//   });

//   return NextResponse.json(response);
// }