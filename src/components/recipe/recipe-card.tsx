import Link from "next/link"
import Image from "next/image"
import { Clock, Users, Star, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime, calculateAverageRating } from "@/lib/utils"

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
  prepTime: number
  cookTime: number
  difficulty: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  ratings: { rating: number }[]
  _count: { favorites: number }
}

interface RecipeCardProps {
  recipe: Recipe
  featured?: boolean
}

export function RecipeCard({ recipe, featured = false }: RecipeCardProps) {
  const averageRating = calculateAverageRating(recipe.ratings)
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-orange-200' : ''}`}>
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative aspect-video">
          <Image
            src={recipe.images[0] || "/placeholder-recipe.jpg"}
            alt={recipe.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={
              recipe.difficulty === 'Easy' ? 'default' :
              recipe.difficulty === 'Medium' ? 'secondary' : 'destructive'
            }>
              {recipe.difficulty}
            </Badge>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-orange-500">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(totalTime)}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {averageRating}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            {recipe._count.favorites}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.user.image || ""} />
              <AvatarFallback className="text-xs">
                {recipe.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{recipe.user.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}