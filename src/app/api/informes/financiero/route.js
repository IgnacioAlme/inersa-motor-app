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
    strftime('%m', fecha) AS month,
    SUM(presupuesto) AS total_revenue
FROM
    Revision
GROUP BY
    month
ORDER BY
    month;`;
// Ensure the result is properly handled

    // Get revenue by month with month and year extraction
    /* const revenueByMonth = await prisma.revision.groupBy({
      by: ["fecha"],
      _sum: {
        presupuesto: true,
      },
    }).then(revenueByMonth => revenueByMonth.map((month) => ({
      month: month.fecha.getMonth() + 1, // Extract month (0-11 to 1-12)
      year: month.fecha.getFullYear(),    // Extract year
      totalRevenue: month._sum.presupuesto || 0,
    }))); */

    return NextResponse.json({ totalRevenue, revenueByMonth }); // Return the total revenue
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
