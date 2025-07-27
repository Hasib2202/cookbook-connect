import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { name: "Breakfast", emoji: "🥞", count: 45 },
  { name: "Lunch", emoji: "🥗", count: 62 },
  { name: "Dinner", emoji: "🍽️", count: 128 },
  { name: "Dessert", emoji: "🍰", count: 84 },
  { name: "Snacks", emoji: "🍿", count: 37 },
  { name: "Beverages", emoji: "🥤", count: 29 },
  { name: "Vegan", emoji: "🥬", count: 56 },
  { name: "Italian", emoji: "🍝", count: 43 },
]

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link key={category.name} href={`/recipes?category=${category.name}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{category.emoji}</div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} recipes</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}