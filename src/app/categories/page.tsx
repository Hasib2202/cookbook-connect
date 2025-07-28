import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CategoriesDisplay } from "@/components/recipe/categories-display"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Recipe Categories</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of recipes organized by categories. 
              From quick breakfast ideas to elaborate dinner courses, find exactly what you&apos;re craving.
            </p>
          </div>
        </div>

        {/* Categories Display */}
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoriesDisplay showAll={true} />
        </Suspense>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 border">
          <h2 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-gray-600 mb-6">
            Use our advanced search to find recipes by ingredients, cooking time, or dietary preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/recipes">Browse All Recipes</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/recipes/create">Share Your Recipe</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}