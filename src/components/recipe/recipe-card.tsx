"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, User, Star, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTime, calculateAverageRating } from "@/lib/utils"

interface Recipe {
  id: string
  title: string
  description: string
  images: string | string[]
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

interface RecipeCardProps {
  recipe: Recipe
  featured?: boolean
}

function safeJsonParse(jsonString: string | string[], fallback: string[] = []) {
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
  const images = safeJsonParse(recipe.images, [])
  const firstImage = images.length > 0 && images[0] ? images[0] : "/placeholder-recipe.jpg"

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg group ${featured ? 'border-2 border-primary' : ''}`}>
      {/* Image container with fixed zoom */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/recipes/${recipe.id}`} className="block h-full">
          <Image
            src={firstImage}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-recipe.jpg";
            }}
          />
          {/* Subtle dark overlay on hover */}
          <div className="absolute inset-0 transition-all duration-300 bg-black/0 group-hover:bg-black/10" />
        </Link>
        
        {/* Difficulty badge - top left */}
        <Badge 
          variant={
            recipe.difficulty === 'Easy' ? 'default' :
            recipe.difficulty === 'Medium' ? 'secondary' : 'destructive'
          }
          className="absolute font-medium text-gray-800 bg-white shadow-sm top-3 left-3"
        >
          {recipe.difficulty}
        </Badge>
        
        {/* Featured badge - only shown if featured, positioned top right */}
        {featured && (
          <Badge 
            variant="default" 
            className="absolute font-medium text-gray-800 bg-white shadow-sm top-3 right-3"
          >
            Featured
          </Badge>
        )}
      </div>
      
      {/* Card content */}
      <CardContent className="p-4 space-y-3">
        {/* Rest of your card content remains the same */}
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-1 group-hover:text-primary">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              {formatTime(totalTime)}
            </div>
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {averageRating.toFixed(1)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-400" />
            {recipe._count.favorites}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <div className="relative flex-shrink-0 w-8 h-8 overflow-hidden bg-gray-100 rounded-full">
            {recipe.user.image ? (
              <Image
                src={recipe.user.image}
                alt={recipe.user.name || "Author"}
                fill
                className="object-cover"
              />
            ) : (
              <User className="absolute w-4 h-4 text-gray-400 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {recipe.user.name || "Anonymous Chef"}
            </p>
            <p className="text-xs text-gray-500 truncate">Recipe Creator</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}