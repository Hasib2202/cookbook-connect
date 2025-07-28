import { RecipeCard } from './recipe-card'

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
  prepTime: number
  cookTime: number
  difficulty: "Easy" | "Medium" | "Hard"
  user: {
    id: string
    name: string | null
    image: string | null
  }
  ratings: { rating: number }[]
  _count: { favorites: number }
}

interface RecentRecipesProps {
  recipes: Recipe[]
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}