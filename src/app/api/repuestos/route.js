import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export default async function handler(request, response) {
  if (request.method === "POST") {
    const filePath = path.join(process.cwd(), "uploads", "data.csv");
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          const promises = results.map((item) => {
            return prisma.repuesto.upsert({
              where: {
                codigo: item.codigo,
              },
              update: {
                distribuidor: item.distribuidor,
                descripcion: item.descripcion,
                marca: item.marca,
                tipo: item.tipo,
                marca_auto: item.marca_auto || "UNIVERSAL",
                precio: parseFloat(item.precio),
              },
              create: {
                codigo: item.codigo,
                distribuidor: item.distribuidor,
                descripcion: item.descripcion,
                marca: item.marca,
                tipo: item.tipo,
                marca_auto: item.marca_auto || "UNIVERSAL",
                precio: parseFloat(item.precio),
              },
            });
          });

          await Promise.all(promises);
          response
            .status(200)
            .json({ message: "datos cargados correctamente" });
        } catch (error) {
          NextResponse.status(500).json({ message: "error" });
        }
      });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
}
