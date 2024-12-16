import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        // Get total number of vehicles
        const totalVehicles = await prisma.vehiculo.count();

         // Get total number of vehicles by year
        const totalVehiclesByYear = await prisma.vehiculo.groupBy({
            by: ["anio"],
            _count: {
                matricula: true,
            },
        });
        const resultTotalVehiclesByYear = totalVehiclesByYear.map(year => ({
            anio: year.anio,
            totalVehicles: year._count.matricula
          }));
        

        // Get total number of vehicles by make
        const totalVehiclesByMake = await prisma.vehiculo.groupBy({
            by: ["marca"],
            _count: {
                matricula: true,
            },
        }); 
        const resultTotalVehiclesByMake = totalVehiclesByMake.map(make => ({
            marca: make.marca,
            totalVehicles: make._count.matricula
          }));

        return NextResponse.json({
            totalVehicles,
            resultTotalVehiclesByYear,
            resultTotalVehiclesByMake, 
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }


}