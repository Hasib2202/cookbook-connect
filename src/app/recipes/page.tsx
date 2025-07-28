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
  searchParams: Promise<SearchParams>
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">All Recipes</h1>
          <p className="text-gray-600">Discover amazing recipes from our community</p>
        </div>
        
        <Suspense fallback={<RecipeSearchSkeleton />}>
          <RecipeSearchAndList searchParams={resolvedSearchParams} />
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
      <div className="p-6 space-y-4 bg-white border rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Results skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden bg-white border rounded-lg animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="w-3/4 h-5 bg-gray-200 rounded" />
              <div className="w-full h-4 bg-gray-200 rounded" />
              <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}