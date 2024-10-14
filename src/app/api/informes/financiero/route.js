import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total revenue from revisions
    const totalRevenue = await prisma.revision.aggregate({
      _sum: {
        presupuesto: true,
      },
    });

const revenueByMonth = await prisma.$queryRaw`SELECT 
    strftime('%m', datetime(fecha / 1000, 'unixepoch')) AS month,
    SUM(presupuesto) AS total_revenue
FROM
    Revision
GROUP BY
    month
ORDER BY
    month;`;

    return NextResponse.json({ totalRevenue, revenueByMonth }); // Return the total revenue
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
