import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen } from "lucide-react"
import Link from "next/link"

async function getUserRecipes(userId: string) {
  return await prisma.recipe.findMany({
    where: { userId },
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
}

export default async function MyRecipesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const recipes = await getUserRecipes(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
              <p className="mt-2 text-gray-600">
                Manage and view all your created recipes
              </p>
            </div>
            <Button asChild>
              <Link href="/recipes/create" className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create New Recipe
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
                  <p className="text-gray-600">Total Recipes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">★</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {recipes.reduce((total, recipe) => total + recipe.ratings.length, 0)}
                  </p>
                  <p className="text-gray-600">Total Reviews</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">♥</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {recipes.reduce((total, recipe) => total + recipe._count.favorites, 0)}
                  </p>
                  <p className="text-gray-600">Total Favorites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipes Grid */}
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={{
                    ...recipe,
                    difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard"
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No recipes yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven&apos;t created any recipes yet. Start sharing your culinary creations!
              </p>
              <Button asChild>
                <Link href="/recipes/create" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Recipe
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
