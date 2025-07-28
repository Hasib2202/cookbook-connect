import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { RecipeSearchAndList } from "@/components/recipe/recipe-search-and-list"
import { Footer } from "@/components/layout/footer"

interface SearchParams {
  search?: string
  category?: string
  difficulty?: string
  page?: string
}

interface RecipesPageProps {
  searchParams: SearchParams
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Recipes</h1>
          <p className="text-gray-600">Discover amazing recipes from our community</p>
        </div>
        
        <Suspense fallback={<RecipeSearchSkeleton />}>
          <RecipeSearchAndList searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function RecipeSearchSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search filters skeleton */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Results skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}