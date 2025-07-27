import { Header } from "@/components/layout/header"

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
        <p className="text-gray-600">Recipe listing will be implemented here...</p>
      </main>
    </div>
  )
}