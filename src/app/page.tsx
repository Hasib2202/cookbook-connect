import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { FeaturedRecipes } from "@/components/recipe/featured-recipes"
import { RecentRecipes } from "@/components/recipe/recent-recipes"
import { Header } from "@/components/layout/header"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoriesGrid } from "@/components/recipe/categories-grid"
import { SearchSection } from "@/components/recipe/search-section"
import { Footer } from "@/components/layout/footer"

async function getFeaturedRecipes() {
  return await prisma.recipe.findMany({
    take: 5,
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { rating: true } },
      _count: { select: { favorites: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function getRecentRecipes() {
  return await prisma.recipe.findMany({
    take: 6,
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { rating: true } },
      _count: { select: { favorites: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function Home() {
  const [featuredRecipes, recentRecipes] = await Promise.all([
    getFeaturedRecipes(),
    getRecentRecipes()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Discover & Share Amazing Recipes
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of food lovers. Share your favorite recipes and discover new culinary adventures.
            </p>
            <SearchSection />
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Recipes</h2>
            <Suspense fallback={<FeaturedRecipesSkeleton />}>
              <FeaturedRecipes recipes={featuredRecipes} />
            </Suspense>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse Categories</h2>
            <CategoriesGrid />
          </div>
        </section>

        {/* Recent Recipes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Recent Recipes</h2>
            <Suspense fallback={<RecentRecipesSkeleton />}>
              <RecentRecipes recipes={recentRecipes} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeaturedRecipesSkeleton() {
  return (
    <div className="flex space-x-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-80 rounded-lg" />
      ))}
    </div>
  )
}

function RecentRecipesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-lg" />
      ))}
    </div>
  )
}