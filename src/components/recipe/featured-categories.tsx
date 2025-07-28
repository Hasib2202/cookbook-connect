"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface CategoryData {
  name: string
  emoji: string
  count: number
  description: string
}

const FEATURED_CATEGORIES: CategoryData[] = [
  { name: "Breakfast", emoji: "🥞", count: 0, description: "Start your day right" },
  { name: "Dinner", emoji: "🍽️", count: 0, description: "Evening delights" },
  { name: "Desserts", emoji: "🍰", count: 0, description: "Sweet treats" },
  { name: "Vegetarian", emoji: "🥬", count: 0, description: "Plant-based meals" },
  { name: "Italian", emoji: "🍝", count: 0, description: "Italian classics" },
  { name: "Quick meals", emoji: "⚡", count: 0, description: "30 min or less" }
]

export function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryData[]>(FEATURED_CATEGORIES)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <FeaturedCategoriesSkeleton />
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <Link key={category.name} href={`/recipes?category=${encodeURIComponent(category.name)}`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full relative overflow-hidden">
            {index < 3 && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Hot
                </Badge>
              </div>
            )}
            <CardContent className="p-4 text-center h-full flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {category.description}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs mx-auto">
                {category.count} recipe{category.count !== 1 ? 's' : ''}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function FeaturedCategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded mx-auto mb-1 animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-5 w-12 bg-gray-200 rounded mx-auto animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
