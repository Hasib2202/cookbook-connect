import Link from "next/link"
import { ChefHat } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">CookBook Connect</span>
            </div>
            <p className="text-gray-400">
              Share and discover amazing recipes from food lovers around the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Recipes</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/recipes" className="hover:text-white">Browse All</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/recipes/create" className="hover:text-white">Submit Recipe</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CookBook Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}