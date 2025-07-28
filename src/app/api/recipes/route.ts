import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recipeSchema } from "@/lib/validations/recipe"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")
    
    const where: any = {}
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        ratings: {
          select: { rating: true }
        },
        _count: {
          select: { favorites: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(recipes)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // The recipeSchema will validate and transform arrays to JSON strings
    const data = recipeSchema.parse(body);

    const recipe = await prisma.recipe.create({
      data: {
        ...data, // Already contains the stringified fields
        userId: session.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}