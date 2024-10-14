import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total number of clients
    const totalClients = await prisma.cliente.count();

    // Get new clients added in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newClientsLastMonth = await prisma.cliente.count({
      where: {
        vehiculo: {
          some: {
            revision: {
              some: {
                fecha: {
                  gte: oneMonthAgo
                }
              }
            }
          }
        }
      }
    });

    // Get new clients added in the last quarter
    const oneQuarterAgo = new Date();
    oneQuarterAgo.setMonth(oneQuarterAgo.getMonth() - 3);
    const newClientsLastQuarter = await prisma.cliente.count({
      where: {
        vehiculo: {
          some: {
            revision: {
              some: {
                fecha: {
                  gte: oneQuarterAgo
                }
              }
            }
          }
        }
      }
    });

    // Get clients with the most vehicles (top 5)
    const clientsWithMostVehicles = await prisma.cliente.findMany({
      select: {
        dni: true,
        nombre: true,
        apellido: true,
        _count: {
          select: { vehiculo: true }
        }
      },
      orderBy: {
        vehiculo: { _count: 'desc' }
      },
      take: 5
    });

    return NextResponse.json({
      totalClients,
      newClientsLastMonth,
      newClientsLastQuarter,
      clientsWithMostVehicles: clientsWithMostVehicles.map(client => ({
        dni: client.dni,
        nombre: client.nombre,
        apellido: client.apellido,
        vehicleCount: client._count.vehiculo
      }))
    });
  } catch (error) {
    console.error("Error fetching client summary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

