import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FeaturedRecipes } from "@/components/recipe/featured-recipes";
import { PaginatedRecentRecipes } from "@/components/recipe/paginated-recent-recipes";
import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedCategories } from "@/components/recipe/featured-categories";
import { SearchSection } from "@/components/recipe/search-section";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image"


async function getFeaturedRecipes() {
  return await prisma.recipe.findMany({
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { rating: true } },
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getRecentRecipes() {
  return await prisma.recipe.findMany({
    take: 24, // Increased to provide more recipes for pagination
    include: {
      user: { select: { id: true, name: true, image: true } },
      ratings: { select: { rating: true } },
      _count: { select: { favorites: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// Add revalidation configuration to ensure fresh data
export const revalidate = 0; // Disable caching for this page

export default async function Home() {
  const [featuredRecipes, recentRecipes] = await Promise.all([
    getFeaturedRecipes(),
    getRecentRecipes(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-4 py-20 md:py-28">
          <div className="absolute inset-0 origin-top transform -skew-y-3 bg-gradient-to-br from-orange-500/5 to-red-600/5"></div>
          <div className="container relative z-10 max-w-6xl mx-auto">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  <span className="text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                    Discover & Share
                  </span>
                  <br />
                  Amazing Recipes
                </h1>
                <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 lg:mx-0">
                  Join our community of food lovers. Share your favorite recipes
                  and discover new culinary adventures.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button asChild className="px-8 py-6 text-lg text-white bg-orange-500 hover:bg-orange-600">
                    <Link href="/recipes/new" className="">Share Your Recipe</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="px-8 py-6 text-lg bg-white hover:bg-gray-100"
                  >
                    <Link href="/recipes">
                      Explore Recipes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                {/* Image container */}
                <div className="overflow-hidden transform shadow-xl aspect-square rounded-2xl rotate-3">
                  <Image
                    src="/hero-dish.jpg" // put your file in /public/hero-dish.jpg
                    alt="Delicious plated recipe"
                    width={600} // adjust to your design ratio
                    height={600}
                    className="object-cover w-full h-full rounded-2xl"
                    priority // because it’s above the fold
                  />
                </div>

                {/* Decorative underlays */}
                <div className="absolute w-2/3 -bottom-6 -left-6 h-2/3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 -z-10" />
                <div className="absolute w-1/2 -top-6 -right-6 h-1/2 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-10 bg-white shadow-sm">
          <div className="container max-w-4xl px-4 mx-auto">
            <SearchSection />
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="relative py-16">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-gray-50"></div>
          <div className="container relative px-4 mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Featured Recipes</h2>
              <Link
                href="/recipes"
                className="flex items-center font-medium text-orange-600 hover:text-orange-700"
              >
                View all recipes <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            {/* Add significant padding to ensure arrows don't overlap with cards */}
            <div className="px-16 md:px-20">
              <Suspense fallback={<FeaturedRecipesSkeleton />}>
                <FeaturedRecipes recipes={featuredRecipes.map(recipe => ({
                  ...recipe,
                  images: JSON.parse(recipe.images || '[]'),
                  difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard",
                  createdAt: recipe.createdAt.toISOString(),
                  updatedAt: recipe.updatedAt.toISOString()
                }))} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="container px-4 mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Browse by Category</h2>
              <p className="max-w-2xl mx-auto mb-6 text-gray-600">
                Find recipes organized by dietary preferences, meal types, and
                cooking styles
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center font-medium text-orange-600 hover:text-orange-700"
              >
                View all categories <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <Suspense fallback={
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-4 text-center bg-white border rounded-lg animate-pulse">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded" />
                    <div className="w-16 h-4 mx-auto mb-1 bg-gray-200 rounded" />
                    <div className="w-20 h-3 mx-auto mb-2 bg-gray-200 rounded" />
                    <div className="w-12 h-5 mx-auto bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            }>
              <FeaturedCategories />
            </Suspense>
          </div>
        </section>

        {/* Recent Recipes */}
        <section id="recent-recipes-section" className="py-16">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Recently Added Recipes</h2>
              <Link
                href="/recipes"
                className="flex items-center font-medium text-orange-600 hover:text-orange-700"
              >
                View all recipes <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <Suspense fallback={<RecentRecipesSkeleton />}>
              <PaginatedRecentRecipes 
                initialRecipes={recentRecipes.map(recipe => ({
                  ...recipe,
                  images: JSON.parse(recipe.images || '[]'),
                  difficulty: recipe.difficulty as "Easy" | "Medium" | "Hard",
                  createdAt: recipe.createdAt.toISOString(),
                  updatedAt: recipe.updatedAt.toISOString()
                }))}
                recipesPerPage={6}
              />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-white bg-gradient-to-r from-orange-600 to-red-600">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Share Your Culinary Creations?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl">
              Join thousands of food enthusiasts sharing their best recipes with
              the world
            </p>
            <Button
              asChild
              className="px-8 py-6 text-lg text-orange-600 bg-white shadow-lg hover:bg-gray-100"
            >
              <Link href="/recipes/new">Get Started - It&apos;s Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeaturedRecipesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="overflow-hidden border rounded-xl">
          <Skeleton className="w-full h-48 rounded-b-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-1/2 h-4" />
            <div className="flex justify-between pt-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-16 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentRecipesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
      {/* Pagination skeleton */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-20 h-8 bg-gray-200 rounded" />
        <div className="flex space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-10 h-8 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded" />
      </div>
      <div className="text-center">
        <div className="w-48 h-4 mx-auto bg-gray-200 rounded" />
      </div>
    </div>
  );
}
