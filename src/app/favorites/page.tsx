import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { Heart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getUserFavorites(userId: string) {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      recipe: {
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
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const favorites = await getUserFavorites(session.user.id)
  const recipes = favorites.map(fav => fav.recipe)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              Your collection of saved recipes
            </p>
          </div>

          {/* Stats and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-red-500" />
                <div className="ml-3">
                  <p className="text-xl font-bold text-gray-900">{favorites.length}</p>
                  <p className="text-sm text-gray-600">Favorite Recipes</p>
                </div>
              </div>
            </div>
            
            {favorites.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search favorites..." 
                  className="pl-10" 
                />
              </div>
            )}
          </div>

          {/* Categories Filter */}
          {favorites.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">All</Button>
                {Array.from(new Set(recipes.map(recipe => recipe.category))).map(category => (
                  <Button key={category} variant="outline" size="sm">
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

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
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring recipes and save your favorites to see them here!
              </p>
              <Button asChild>
                <Link href="/recipes" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Discover Recipes
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
