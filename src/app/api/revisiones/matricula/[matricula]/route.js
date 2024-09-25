import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";

// ver todas las revisiones de un vehiculo
export async function GET(request, { params }) {
    const { id } = params.matricula;
    const response = await prisma.revision.findMany({
      where: { vehiculoId: id },
    });
  
    return NextResponse.json(response);
  }