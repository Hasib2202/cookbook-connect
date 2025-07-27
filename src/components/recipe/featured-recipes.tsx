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
  difficulty: string
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
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="featured-recipes-swiper"
    >
      {recipes.map((recipe) => (
        <SwiperSlide key={recipe.id}>
          <RecipeCard recipe={recipe} featured />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}