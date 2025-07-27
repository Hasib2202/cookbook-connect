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

export default async function RecipePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const recipe = await getRecipe(params.id)
  
  if (!recipe) {
    notFound()
  }

  const userFavorite = await getUserFavorite(params.id, session?.user?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecipeDetail 
          recipe={recipe} 
          isOwner={recipe.userId === session?.user?.id}
          isFavorited={!!userFavorite}
          currentUserId={session?.user?.id}
        />
      </main>
    </div>
  )
}