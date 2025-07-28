"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatTime, calculateAverageRating } from "@/lib/utils"
import { RatingForm } from "./rating-form"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Recipe {
  id: string
  title: string
  description: string
  images: string | string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  category: string
  ingredients: string | Array<{name: string, amount: string, unit: string}>
  instructions: string | Array<{step: number, instruction: string}>
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

// Helper function to safely parse JSON strings
function safeJsonParse<T>(jsonString: string | T[], fallback: T[] = []): T[] {
  if (Array.isArray(jsonString)) return jsonString;
  if (typeof jsonString !== 'string') return fallback;
  
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

export function RecipeDetail({ recipe, isOwner, isFavorited, currentUserId }: RecipeDetailProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [favoritesCount, setFavoritesCount] = useState(recipe._count.favorites)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({})
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  
  // Parse the JSON strings safely
  const images = safeJsonParse(recipe.images, [])
  const ingredients = safeJsonParse(recipe.ingredients, [])
  const instructions = safeJsonParse(recipe.instructions, [])
  
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
    } catch {
      toast.error("Something went wrong")
    }
  }

  const handleDelete = async () => {
    if (!isOwner) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Recipe deleted successfully")
        router.push("/recipes")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete recipe")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">{recipe.title}</h1>
            <p className="text-lg text-gray-600">{recipe.description}</p>
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
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="text-white bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Delete Recipe</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete &quot;{recipe.title}&quot;? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-white bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Deleting..." : "Delete Recipe"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {/* Recipe Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(totalTime)}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center">
            <ChefHat className="w-4 h-4 mr-1" />
            {recipe.difficulty}
          </div>
          {averageRating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
              {averageRating} ({recipe.ratings.length} reviews)
            </div>
          )}
        </div>

        <div className="flex items-center mt-4 space-x-4">
          <Badge className="text-gray-900 bg-white border border-gray-200 hover:bg-gray-50">{recipe.category}</Badge>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={recipe.user.image || ""} />
              <AvatarFallback>
                {recipe.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">By {recipe.user.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Images */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="recipe-images-swiper"
                >
                  {images.map((image: string, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="relative aspect-video">
                        <Image
                          src={image}
                          alt={`${recipe.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex items-center justify-center bg-gray-200 aspect-video">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
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
                    {ingredients.length > 0 ? (
                      ingredients.map((ingredient: {name: string, amount: string, unit: string}, index: number) => (
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
                      ))
                    ) : (
                      <p className="text-gray-500">No ingredients available</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="mt-4">
                  <div className="space-y-4">
                    {instructions.length > 0 ? (
                      instructions.map((instruction: {step: number, instruction: string}) => (
                        <div key={instruction.step} className="flex space-x-4">
                          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white bg-orange-500 rounded-full">
                            {instruction.step}
                          </div>
                          <p className="pt-1 text-sm">{instruction.instruction}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No instructions available</p>
                    )}
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
                <Badge 
                  className={
                    recipe.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' :
                    recipe.difficulty === 'Medium' 
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                  }
                >
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
                        <Avatar className="w-6 h-6">
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
