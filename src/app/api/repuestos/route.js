import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    const repuestos = await prisma.repuesto.findMany();
    return NextResponse.json(repuestos);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching repuestos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    // Check if the file is a CSV
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 });
    }

    // Check file size (e.g., limit to 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the limit (5MB)" }, { status: 400 });
    }

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';'  // Specify semicolon as the delimiter
    });

    const createdRepuestos = await prisma.$transaction(
      records.map((record) => 
        prisma.repuesto.upsert({
          where: { codigo: record.codigo },
          update: {
            distribuidor: record.distribuidor,
            descripcion: record.descripcion,
            marca: record.marca,
            tipo: record.tipo,
            marca_auto: record.marca_auto || "UNIVERSAL",
            precio: parseFloat(record.precio.replace(',', '.')),  // Handle comma as decimal separator
          },
          create: {
            codigo: record.codigo,
            distribuidor: record.distribuidor,
            descripcion: record.descripcion,
            marca: record.marca,
            tipo: record.tipo,
            marca_auto: record.marca_auto || "UNIVERSAL",
            precio: parseFloat(record.precio.replace(',', '.')),  // Handle comma as decimal separator
          },
        })
      )
    );

    return NextResponse.json({ message: "CSV data processed successfully", count: createdRepuestos.length });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json({ error: "Error processing CSV file" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { codigo, ...updateData } = body;

    if (!codigo) {
      return NextResponse.json({ error: "Código es requerido" }, { status: 400 });
    }

    const updatedRepuesto = await prisma.repuesto.update({
      where: { codigo },
      data: updateData,
    });

    return NextResponse.json(updatedRepuesto);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar repuesto" }, { status: 500 });
  }
}
