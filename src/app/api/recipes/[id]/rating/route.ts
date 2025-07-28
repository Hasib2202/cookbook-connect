import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = ratingSchema.parse(body)

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: id
        }
      }
    })

    if (existingRating) {
      const updated = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating, comment },
        include: {
          user: {
            select: { id: true, name: true, image: true }
          }
        }
      })
      return NextResponse.json(updated)
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        comment,
        userId: session.user.id,
        recipeId: id
      },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        }
      }
    })

    return NextResponse.json(newRating, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    )
  }
}