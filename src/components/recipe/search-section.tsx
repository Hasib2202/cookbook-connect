"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const POPULAR_SEARCHES = [
  "Pasta", "Pizza", "Chicken", "Dessert", "Vegetarian", "Quick meals"
]

export function SearchSection() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handlePopularSearch = (searchTerm: string) => {
    router.push(`/recipes?search=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="space-y-6 text-center">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto">
        <div className="flex">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              type="text"
              placeholder="Search for recipes, ingredients, or cuisine..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-base border-r-0 rounded-r-none pl-11 focus:border-orange-500"
            />
          </div>
          <Button 
            type="submit" 
            className="h-12 px-8 text-white bg-orange-600 rounded-l-none hover:bg-orange-700"
          >
            <Search className="w-5 h-5 mr-2 text-white" />
            Search
          </Button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Popular searches:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <Badge
              key={term}
              variant="secondary"
              className="transition-colors cursor-pointer hover:bg-orange-100 hover:text-orange-700"
              onClick={() => handlePopularSearch(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button 
          variant="outline" 
          onClick={() => router.push("/recipes")}
          className="hover:bg-orange-50 hover:border-orange-200"
        >
          Browse All Recipes
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.push("/categories")}
          className="hover:bg-orange-50 hover:border-orange-200"
        >
          Browse by Category
        </Button>
      </div>
    </div>
  )
}