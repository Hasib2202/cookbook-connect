import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get count of recipes for each category
    const categoryCounts = await prisma.recipe.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Transform the data into a more usable format
    const counts: Record<string, number> = {}
    categoryCounts.forEach(item => {
      if (item.category) {
        counts[item.category] = item._count.id
      }
    })

    // Also get total count
    const totalRecipes = await prisma.recipe.count()

    return NextResponse.json({
      ...counts,
      _total: totalRecipes,
      _categories: categoryCounts.length
    })
  } catch (error) {
    console.error("Error fetching category counts:", error)
    return NextResponse.json(
      { error: "Failed to fetch category counts" },
      { status: 500 }
    )
  }
}
