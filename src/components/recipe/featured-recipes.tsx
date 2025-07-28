"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { RecipeCard } from './recipe-card'

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

interface FeaturedRecipesProps {
  recipes: Recipe[]
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.featured-next',
          prevEl: '.featured-prev',
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-orange-300',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-orange-600'
        }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="featured-recipes-swiper !pb-12"
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <RecipeCard recipe={recipe} featured />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons - Positioned far outside */}
      <button className="absolute z-10 flex items-center justify-center w-12 h-12 transition-all duration-300 -translate-y-1/2 bg-white border border-gray-100 rounded-full shadow-lg featured-prev -left-16 top-1/2 hover:bg-orange-50 hover:shadow-xl hover:scale-110 group">
        <svg className="w-5 h-5 text-gray-600 transition-colors group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button className="absolute z-10 flex items-center justify-center w-12 h-12 transition-all duration-300 -translate-y-1/2 bg-white border border-gray-100 rounded-full shadow-lg featured-next -right-16 top-1/2 hover:bg-orange-50 hover:shadow-xl hover:scale-110 group">
        <svg className="w-5 h-5 text-gray-600 transition-colors group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}