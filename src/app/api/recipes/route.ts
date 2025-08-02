import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { recipeSchema } from "@/lib/validations/recipe"
import { revalidatePath } from "next/cache"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    
    // Build where clause
    const where: {
      category?: string
      difficulty?: string
      OR?: Array<{
        title?: { contains: string }
        description?: { contains: string }
      }>
    } = {}
    
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty
    
    // For SQLite, we'll handle search differently to make it case-insensitive
    if (search) {
      // SQLite case-insensitive search using LIKE
      where.OR = [
        { 
          title: { 
            contains: search,
            // SQLite is case-insensitive by default for LIKE operations
          } 
        },
        { 
          description: { 
            contains: search,
          } 
        }
      ]
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit
    
    // Sort by most recent
    const orderBy = { createdAt: 'desc' as const }
    
    // Get total count for pagination
    const total = await prisma.recipe.count({ where })
    
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
      orderBy,
      skip,
      take: limit
    })
    
    // Transform the recipes to match expected format
    const transformedRecipes = recipes.map(recipe => ({
      ...recipe,
      images: JSON.parse(recipe.images || '[]'),
      ingredients: JSON.parse(recipe.ingredients || '[]'),
      instructions: JSON.parse(recipe.instructions || '[]'),
      difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard"
    }))
    
    return NextResponse.json({
      recipes: transformedRecipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Error fetching recipes:", error)
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

    // Revalidate the landing page and recipes page to show new recipe
    revalidatePath("/");
    revalidatePath("/recipes");

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}