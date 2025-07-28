import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Params {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: id
        }
      }
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      })
      return NextResponse.json({ favorited: false })
    }

    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        recipeId: id
      }
    })

    return NextResponse.json({ favorited: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    )
  }
}