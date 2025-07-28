import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const totalRecipes = await prisma.recipe.count()
    const totalUsers = await prisma.user.count()
    
    // Get some sample recipes for testing
    const sampleRecipes = await prisma.recipe.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      totalRecipes,
      totalUsers,
      sampleRecipes,
      message: totalRecipes > 0 ? "Database has recipes" : "No recipes in database yet"
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      { error: "Database check failed", details: error },
      { status: 500 }
    )
  }
}
