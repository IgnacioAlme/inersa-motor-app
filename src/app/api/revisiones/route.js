import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const matricula = searchParams.get('matricula');

  try {
    let revisiones;
    if (matricula) {
      revisiones = await prisma.revision.findMany({
        where: { vehiculoId: matricula },
        include: { vehiculo: true },
      });
    } else {
      revisiones = await prisma.revision.findMany({
        include: { vehiculo: true },
      });
    }
    return NextResponse.json(revisiones);
  } catch (error) {
    console.error('Error fetching revisiones:', error);
    return NextResponse.json({ error: 'Error fetching revisiones' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { detalles, presupuesto, vehiculoId, repuestos } = body;

    const repuestosString = repuestos.map(r => `${r.codigo} - ${r.descripcion}`).join(', ');
    const fullDetalles = `${detalles}\n\nRepuestos utilizados: ${repuestosString}`;

    const newRevision = await prisma.revision.create({
      data: {
        detalles: fullDetalles,
        presupuesto,
        vehiculoId,
      },
    });

    return NextResponse.json(newRevision, { status: 201 });
  } catch (error) {
    console.error('Error creating revision:', error);
    return NextResponse.json({ error: 'Error creating revision' }, { status: 500 });
  }
}