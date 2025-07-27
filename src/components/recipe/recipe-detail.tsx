"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Clock, Users, Star, Heart, Edit, Trash2, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { formatTime, calculateAverageRating } from "@/lib/utils"
import { RatingForm } from "./rating-form"
import toast from "react-hot-toast"

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  category: string
  ingredients: any
  instructions: any
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  ratings: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }>
  _count: {
    favorites: number
  }
}

interface RecipeDetailProps {
  recipe: Recipe
  isOwner: boolean
  isFavorited: boolean
  currentUserId?: string
}

export function RecipeDetail({ recipe, isOwner, isFavorited, currentUserId }: RecipeDetailProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [favoritesCount, setFavoritesCount] = useState(recipe._count.favorites)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({})
  
  const averageRating = calculateAverageRating(recipe.ratings)
  const totalTime = recipe.prepTime + recipe.cookTime

  const handleFavorite = async () => {
    if (!currentUserId) {
      toast.error("Please login to favorite recipes")
      return
    }

    try {
      const response = await fetch(`/api/recipes/${recipe.id}/favorite`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setFavorited(data.favorited)
        setFavoritesCount(prev => data.favorited ? prev + 1 : prev - 1)
        toast.success(data.favorited ? "Added to favorites" : "Removed from favorites")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-gray-600 text-lg">{recipe.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={favorited ? "default" : "outline"}
              size="sm"
              onClick={handleFavorite}
            >
              <Heart className={`h-4 w-4 mr-2 ${favorited ? 'fill-current' : ''}`} />
              {favoritesCount}
            </Button>
            
            {isOwner && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/recipes/edit/${recipe.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Recipe Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(totalTime)}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center">
            <ChefHat className="h-4 w-4 mr-1" />
            {recipe.difficulty}
          </div>
          {averageRating > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              {averageRating} ({recipe.ratings.length} reviews)
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <Badge>{recipe.category}</Badge>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipe.user.image || ""} />
              <AvatarFallback>
                {recipe.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">By {recipe.user.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="recipe-images-swiper"
              >
                {recipe.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`${recipe.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </CardContent>
          </Card>

          {/* Recipe Content */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ingredients" className="mt-4">
                  <div className="space-y-2">
                    {recipe.ingredients.map((ingredient: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`ingredient-${index}`}
                          checked={checkedIngredients[index] || false}
                          onCheckedChange={() => handleIngredientCheck(index)}
                        />
                        <label
                          htmlFor={`ingredient-${index}`}
                          className={`text-sm ${checkedIngredients[index] ? 'line-through text-gray-500' : ''}`}
                        >
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="mt-4">
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction: any) => (
                      <div key={instruction.step} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {instruction.step}
                        </div>
                        <p className="text-sm pt-1">{instruction.instruction}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipe Info */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Prep Time</span>
                <span>{formatTime(recipe.prepTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cook Time</span>
                <span>{formatTime(recipe.cookTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time</span>
                <span className="font-medium">{formatTime(totalTime)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Servings</span>
                <span>{recipe.servings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty</span>
                <Badge variant={
                  recipe.difficulty === 'Easy' ? 'default' :
                  recipe.difficulty === 'Medium' ? 'secondary' : 'destructive'
                }>
                  {recipe.difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Rating Form */}
          {currentUserId && currentUserId !== recipe.user.id && (
            <Card>
              <CardHeader>
                <CardTitle>Rate this Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingForm 
                  recipeId={recipe.id} 
                  existingRating={recipe.ratings.find(r => r.user.id === currentUserId)}
                />
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {recipe.ratings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({recipe.ratings.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipe.ratings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={rating.user.image || ""} />
                          <AvatarFallback className="text-xs">
                            {rating.user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{rating.user.name}</span>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-gray-600">{rating.comment}</p>
                    )}
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}