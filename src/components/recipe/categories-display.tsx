"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChefHat, Clock, Users } from "lucide-react"

interface CategoryData {
  name: string
  emoji: string
  count: number
  description: string
  popular: boolean
}

const CATEGORIES: CategoryData[] = [
  { name: "Breakfast", emoji: "🥞", count: 0, description: "Start your day right", popular: true },
  { name: "Lunch", emoji: "🥗", count: 0, description: "Midday meals", popular: true },
  { name: "Dinner", emoji: "🍽️", count: 0, description: "Evening delights", popular: true },
  { name: "Desserts", emoji: "🍰", count: 0, description: "Sweet treats", popular: true },
  { name: "Appetizers", emoji: "🥨", count: 0, description: "Perfect starters", popular: false },
  { name: "Main Course", emoji: "🍖", count: 0, description: "Hearty mains", popular: true },
  { name: "Snacks", emoji: "🍿", count: 0, description: "Quick bites", popular: false },
  { name: "Beverages", emoji: "🥤", count: 0, description: "Drinks & smoothies", popular: false },
  { name: "Vegetarian", emoji: "🥬", count: 0, description: "Plant-based meals", popular: true },
  { name: "Vegan", emoji: "🌱", count: 0, description: "100% plant-based", popular: true },
  { name: "Gluten-Free", emoji: "🌾", count: 0, description: "Gluten-free options", popular: false },
  { name: "Italian", emoji: "🍝", count: 0, description: "Italian classics", popular: false },
  { name: "Asian", emoji: "🍜", count: 0, description: "Asian flavors", popular: false },
  { name: "Mexican", emoji: "🌮", count: 0, description: "Mexican cuisine", popular: false },
  { name: "Mediterranean", emoji: "🫒", count: 0, description: "Mediterranean diet", popular: false },
  { name: "American", emoji: "🍔", count: 0, description: "American favorites", popular: false }
]

interface CategoriesDisplayProps {
  showAll?: boolean
}

export function CategoriesDisplay({ showAll = false }: CategoriesDisplayProps) {
  const [categories, setCategories] = useState<CategoryData[]>(CATEGORIES)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch category counts from API
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch('/api/recipes/categories/counts')
        if (response.ok) {
          const counts = await response.json()
          setCategories(prev => 
            prev.map(cat => ({
              ...cat,
              count: counts[cat.name] || 0
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching category counts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Split into popular and all categories
  const popularCategories = filteredCategories.filter(cat => cat.popular)
  const allCategories = showAll ? filteredCategories : popularCategories

  if (loading) {
    return <CategoriesSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      {showAll && (
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <ChefHat className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.count, 0)}</div>
            <div className="text-sm text-gray-600">Total Recipes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{popularCategories.length}</div>
            <div className="text-sm text-gray-600">Popular Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div>
        {!showAll && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Categories</h2>
            <Button asChild variant="outline">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => (
            <Link key={category.name} href={`/recipes?category=${encodeURIComponent(category.name)}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {category.emoji}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.count} recipe{category.count !== 1 ? 's' : ''}
                    </Badge>
                    {category.popular && (
                      <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No results */}
        {showAll && searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-6 w-12 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
