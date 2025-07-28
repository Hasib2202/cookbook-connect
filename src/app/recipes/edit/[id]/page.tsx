import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { RecipeForm } from "@/components/recipe/recipe-form"

// Helper function to safely parse JSON strings
function safeJsonParse<T>(jsonString: string | T[] | undefined, fallback: T[] = []): T[] {
  if (Array.isArray(jsonString)) return jsonString;
  if (typeof jsonString !== 'string') return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, image: true }
      }
    }
  })
  return recipe
}

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const recipe = await getRecipe(id)
  
  if (!recipe) {
    redirect("/recipes")
  }

  // Check if user owns this recipe
  if (recipe.userId !== session.user.id) {
    redirect("/recipes")
  }

  // Prepare initial data for the form
  const initialData = {
    title: recipe.title,
    description: recipe.description,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard",
    category: recipe.category,
    ingredients: safeJsonParse<{name: string, amount: string, unit: string}>(recipe.ingredients),
    instructions: safeJsonParse<{step: number, instruction: string}>(recipe.instructions),
    images: safeJsonParse<string>(recipe.images),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Recipe</h1>
            <p className="mt-2 text-gray-600">
              Update your recipe details below.
            </p>
          </div>
          
          <RecipeForm 
            initialData={initialData}
            recipeId={id}
          />
        </div>
      </main>
    </div>
  )
}
