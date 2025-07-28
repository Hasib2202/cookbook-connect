import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { RecipeDetail } from "@/components/recipe/recipe-detail"

async function getRecipe(id: string) {
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

  return recipe
}

async function getUserFavorite(recipeId: string, userId?: string) {
  if (!userId) return null
  
  return await prisma.favorite.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId
      }
    }
  })
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const recipe = await getRecipe(id)
  
  if (!recipe) {
    notFound()
  }

  const userFavorite = await getUserFavorite(id, session?.user?.id)

  // Serialize dates for client component
  const serializedRecipe = {
    ...recipe,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    ratings: recipe.ratings.map(rating => ({
      ...rating,
      createdAt: rating.createdAt.toISOString()
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container px-4 py-8 mx-auto">
        <RecipeDetail 
          recipe={serializedRecipe} 
          isOwner={recipe.userId === session?.user?.id}
          isFavorited={!!userFavorite}
          currentUserId={session?.user?.id}
        />
      </main>
    </div>
  )
}