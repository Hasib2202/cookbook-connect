"use client"

import Link from "next/link"
import { Clock, Users, Star, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime, calculateAverageRating } from "@/lib/utils"

interface Recipe {
  id: string
  title: string
  description: string
  images: string | string[]
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

// Helper function to safely parse JSON strings
function safeJsonParse(jsonString: string | any[], fallback: any[] = []) {
  if (Array.isArray(jsonString)) return jsonString;
  if (typeof jsonString !== 'string') return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

export function RecipeCard({ recipe, featured = false }: RecipeCardProps) {
  const averageRating = calculateAverageRating(recipe.ratings)
  const totalTime = recipe.prepTime + recipe.cookTime
  
  // Parse images safely and provide fallback
  const images = safeJsonParse(recipe.images, [])
  const firstImage = images.length > 0 && images[0] ? images[0] : "/placeholder-recipe.jpg"

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${featured ? 'ring-2 ring-orange-200' : ''}`}>
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative aspect-video">
          <img
            src={firstImage}
            alt={recipe.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-recipe.jpg";
            }}
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
          <h3 className="mb-2 text-lg font-semibold line-clamp-1 hover:text-orange-500">
            {recipe.title}
          </h3>
        </Link>
       
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {recipe.description}
        </p>
       
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(totalTime)}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                {averageRating}
              </div>
            )}
          </div>
         
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {recipe._count.favorites}
          </div>
        </div>
       
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
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