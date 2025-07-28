import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Params {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { favorites: true }
        }
      }
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id }
    })

    if (!recipe || recipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    // Prepare data for database - stringify arrays
    const updateData = {
      ...body,
      ingredients: typeof body.ingredients === 'object' ? JSON.stringify(body.ingredients) : body.ingredients,
      instructions: typeof body.instructions === 'object' ? JSON.stringify(body.instructions) : body.instructions,
      images: typeof body.images === 'object' ? JSON.stringify(body.images) : body.images
    }
    
    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    return NextResponse.json(updatedRecipe)
  } catch (error) {
    console.error('Failed to update recipe:', error)
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id }
    })

    if (!recipe || recipe.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.recipe.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error('Failed to delete recipe:', error)
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    )
  }
}