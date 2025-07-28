"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, User, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTime, calculateAverageRating } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
    <Card className={`relative overflow-hidden transition-all duration-300 group
      hover:shadow-xl ${featured ? 'border-2 border-primary' : 'border border-gray-200'}`}>
      
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/recipes/${recipe.id}`} className="block h-full">
          <Image
            src={firstImage}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-recipe.jpg";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </Link>
        
        {/* Difficulty badge - top left */}
        <Badge 
          variant="default"
          className={`absolute top-3 left-3 font-medium shadow-sm
            ${recipe.difficulty === 'Easy' ? 'bg-green-500 hover:bg-green-500' : 
              recipe.difficulty === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-500' : 
              'bg-red-500 hover:bg-red-500'}`}
        >
          {recipe.difficulty}
        </Badge>
        
        {/* Featured badge - top right */}
        {featured && (
          <Badge 
            variant="default" 
            className="absolute font-medium shadow-sm top-3 right-3 bg-primary text-primary-foreground"
          >
            Featured
          </Badge>
        )}
        
        {/* Quick stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                {formatTime(totalTime)}
              </div>
              {averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {averageRating.toFixed(1)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              {recipe._count.favorites}
            </div>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <CardContent className="p-4">
        <Link href={`/recipes/${recipe.id}`}>
          <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors line-clamp-1 group-hover:text-primary">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
          {recipe.description}
        </p>
        
        {/* Author section */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <div className="relative flex-shrink-0 w-8 h-8 overflow-hidden bg-gray-100 border rounded-full">
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

// This would typically be in a separate FeaturedRecipes component
export function FeaturedRecipesCarousel({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} featured={true} />
        ))}
      </div>
      
      {/* Improved Carousel Navigation */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        <Button 
          variant="outline" 
          size="icon"
          className="w-12 h-12 border-gray-300 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>
        
        {/* Pagination dots */}
        <div className="flex space-x-2">
          {[1, 2, 3].map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === 0 ? "bg-primary w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="w-12 h-12 border-gray-300 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </Button>
      </div>
      
      {/* View All Button */}
      <div className="mt-10 text-center">
        <Button asChild variant="ghost" className="text-primary hover:bg-orange-50">
          <Link href="/recipes">
            View all recipes
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}