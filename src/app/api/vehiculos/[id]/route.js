import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Ver un vehiculo
export async function GET(request, { params }) {
  const { id } = params.id;
  const response = await prisma.vehiculo.findUnique({
    where: { matricula: id },
  });
  return NextResponse.json(response);
}

// Actualizar un vehiculo
export async function PUT(request, { params }) {
  try {
    const { matricula } = params;
    const data = await request.json();
    const updatedVehicle = await prisma.vehiculo.update({
      where: { matricula },
      data: {
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio,
      },
    });
    return NextResponse.json({ message: "Vehículo actualizado exitosamente", data: updatedVehicle });
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    return NextResponse.json(
      { error: "Error al actualizar vehículo", details: error.message },
      { status: 500 }
    );
  }
}
// Eliminar un vehiculo
export async function DELETE(request, { params }) {
  try {
    const { matricula } = params;
    await prisma.vehiculo.delete({
      where: { matricula },
    });
    return NextResponse.json({ message: "Vehículo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    return NextResponse.json(
      { error: "Error al eliminar vehículo", details: error.message },
      { status: 500 }
    );
  }
}



// Ver revisiones de un vehiculo

// export async function GET(request, {params}) {
//   const { id } = params.id;
//   const response = await prisma.revision.findMany({
//     where: { vehiculoId: id },
//   });

//   return NextResponse.json(response);
// }