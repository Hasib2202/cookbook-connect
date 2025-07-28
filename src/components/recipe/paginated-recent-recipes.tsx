"use client"

import { useState } from 'react'
import { RecipeCard } from './recipe-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
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

interface PaginatedRecentRecipesProps {
  initialRecipes: Recipe[]
  recipesPerPage?: number
}

export function PaginatedRecentRecipes({ 
  initialRecipes, 
  recipesPerPage = 6 
}: PaginatedRecentRecipesProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes || [])
  const [loading, setLoading] = useState(false)
  const [totalRecipes, setTotalRecipes] = useState(initialRecipes?.length || 0)

  const totalPages = Math.ceil(totalRecipes / recipesPerPage)
  
  // For page 1, use sliced initial recipes. For other pages, use fetched recipes directly
  const currentRecipes = currentPage === 1 
    ? recipes.slice(0, recipesPerPage)
    : recipes

  const fetchRecipes = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/recipes?page=${page}&limit=${recipesPerPage}&sort=recent`)
      if (response.ok) {
        const data = await response.json()
        setRecipes(data.recipes || [])
        setTotalRecipes(data.pagination?.total || data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      // Always fetch from API for the requested page
      fetchRecipes(page)
      // Scroll to top of section
      document.getElementById('recent-recipes-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const generatePageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: recipesPerPage }).map((_, i) => (
            <div key={i} className="overflow-hidden border rounded-xl animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-b-none" />
              <div className="p-4 space-y-2">
                <div className="w-4/5 h-5 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="flex justify-between pt-2">
                  <div className="w-24 h-6 bg-gray-200 rounded" />
                  <div className="w-10 h-6 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Recipes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                )
              }

              const isCurrentPage = pageNum === currentPage
              return (
                <Button
                  key={pageNum}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`min-w-[40px] ${
                    isCurrentPage 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'hover:bg-orange-50'
                  }`}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      {totalRecipes > 0 && (
        <div className="text-sm text-center text-gray-600">
          Showing {((currentPage - 1) * recipesPerPage) + 1}-{Math.min(currentPage * recipesPerPage, totalRecipes)} of {totalRecipes} recipes
        </div>
      )}
    </div>
  )
}
