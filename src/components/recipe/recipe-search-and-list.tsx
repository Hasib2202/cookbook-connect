"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecipeCard } from "./recipe-card"
import { Badge } from "@/components/ui/badge"

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
  prepTime: number
  cookTime: number
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  ratings: { rating: number }[]
  _count: { favorites: number }
}

interface SearchParams {
  search?: string
  category?: string
  difficulty?: string
  page?: string
}

interface RecipeSearchAndListProps {
  searchParams: SearchParams
}

const CATEGORIES = [
  "Appetizers",
  "Main Course", 
  "Desserts",
  "Beverages",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Vegetarian",
  "Vegan",
  "Gluten-Free"
]

const DIFFICULTIES = ["Easy", "Medium", "Hard"]

export function RecipeSearchAndList({ searchParams }: RecipeSearchAndListProps) {
  const router = useRouter()
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "")
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.difficulty || "")
  
  // State for recipes and pagination
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || "1"))
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecipes, setTotalRecipes] = useState(0)
  const [noResults, setNoResults] = useState(false)

  // Fetch recipes based on current filters
  const fetchRecipes = async (page = 1) => {
    setLoading(true)
    setNoResults(false)
    
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedCategory) params.append("category", selectedCategory)
      if (selectedDifficulty) params.append("difficulty", selectedDifficulty)
      params.append("page", page.toString())
      params.append("limit", "12")

      console.log('Fetching recipes with params:', params.toString())
      
      const response = await fetch(`/api/recipes?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        setRecipes(data.recipes || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalRecipes(data.pagination?.total || 0)
        setCurrentPage(page)
        setNoResults((data.recipes || []).length === 0)
      } else {
        console.error('API Error:', response.status, response.statusText)
        setNoResults(true)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setNoResults(true)
    } finally {
      setLoading(false)
    }
  }

  // Update URL with current filters
  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append("search", searchQuery)
    if (selectedCategory) params.append("category", selectedCategory)
    if (selectedDifficulty) params.append("difficulty", selectedDifficulty)
    if (currentPage > 1) params.append("page", currentPage.toString())
    
    const newURL = params.toString() ? `/recipes?${params.toString()}` : "/recipes"
    router.push(newURL, { scroll: false })
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchRecipes(1)
    updateURL()
  }

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    if (type === "category") {
      setSelectedCategory(value === "all-categories" ? "" : value)
    } else if (type === "difficulty") {
      setSelectedDifficulty(value === "all-difficulties" ? "" : value)
    }
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedDifficulty("")
    setCurrentPage(1)
    setNoResults(false)
    // Fetch all recipes when clearing filters
    const params = new URLSearchParams()
    params.append("page", "1")
    params.append("limit", "12")
    
    fetch(`/api/recipes?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        setRecipes(data.recipes || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalRecipes(data.pagination?.total || 0)
        setCurrentPage(1)
        setNoResults((data.recipes || []).length === 0)
      })
      .catch(error => {
        console.error("Error clearing filters:", error)
      })
    
    router.push("/recipes")
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchRecipes(page)
    updateURL()
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Initial load and when searchParams change
  useEffect(() => {
    fetchRecipes(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Trigger search when searchQuery changes (from URL params)
  useEffect(() => {
    if (searchQuery) {
      fetchRecipes(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Update filters when URL search params change
  useEffect(() => {
    if (selectedCategory || selectedDifficulty) {
      fetchRecipes(1)
      updateURL()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedDifficulty])

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedDifficulty

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="p-6 bg-white border rounded-lg">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search recipes by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select 
              value={selectedCategory || "all-categories"} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-categories">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedDifficulty || "all-difficulties"} 
              onValueChange={(value) => handleFilterChange("difficulty", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                {DIFFICULTIES.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </form>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentPage(1)
                    fetchRecipes(1)
                  }}
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSelectedCategory("")
                    setCurrentPage(1)
                  }}
                />
              </Badge>
            )}
            {selectedDifficulty && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Difficulty: {selectedDifficulty}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSelectedDifficulty("")
                    setCurrentPage(1)
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {loading ? "Searching..." : `${totalRecipes} Recipe${totalRecipes !== 1 ? "s" : ""} Found`}
          </h2>
          {hasActiveFilters && !loading && (
            <p className="mt-1 text-sm text-gray-600">
              {searchQuery && `Search: "${searchQuery}"`}
              {searchQuery && (selectedCategory || selectedDifficulty) && " • "}
              {selectedCategory && `Category: ${selectedCategory}`}
              {selectedCategory && selectedDifficulty && " • "}
              {selectedDifficulty && `Difficulty: ${selectedDifficulty}`}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <RecipeSearchSkeleton />
      ) : noResults ? (
        <div className="py-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No recipes found</h3>
            {searchQuery ? (
              <p className="mb-4 text-gray-600">
                No recipes found for &quot;{searchQuery}&quot;. Try different keywords or browse our categories.
              </p>
            ) : (
              <p className="mb-4 text-gray-600">
                Try adjusting your search criteria or browse all recipes.
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
              <Button asChild variant="outline">
                <a href="/categories">Browse Categories</a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Recipe Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RecipeSearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden bg-white border rounded-lg animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="w-3/4 h-5 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-1/2 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
