"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChefHat,
  Plus,
  Settings,
  LogOut,
  Heart,
  BookOpen,
  Search,
} from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  // Debug session data
  console.log("Header session data:", session)
  console.log("User image URL:", session?.user?.image)

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-xl font-bold">CookBook Connect</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        {/* <div className="flex-1 hidden max-w-md mx-8 md:block">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 focus:border-orange-500 focus:ring-orange-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div> */}

        {/* Nav links */}
        <nav className="items-center hidden space-x-6 lg:flex">
          <Link href="/recipes" className="text-sm font-medium hover:text-orange-500">
            Recipes
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-orange-500">
            Categories
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => router.push("/recipes")}
          >
            <Search className="w-4 h-4" />
          </Button>

          {session ? (
            <>
              {/* Create Recipe button */}
              <Button asChild size="sm">
                <Link href="/recipes/create" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Recipe
                </Link>
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center px-2 space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={session.user?.image || ""} 
                        alt={session.user?.name || "User"} 
                        className="object-cover"
                        onLoad={() => console.log("Avatar image loaded:", session.user?.image)}
                        onError={() => console.log("Avatar image failed to load:", session.user?.image)}
                      />
                      <AvatarFallback className="font-semibold text-white bg-orange-500">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {session.user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  forceMount
                  className="w-64 overflow-hidden bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg "
                >
                  {/* Header */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <DropdownMenuItem
                      asChild
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Link href="/my-recipes">
                        <BookOpen className="w-4 h-4 mr-2" />
                        My Recipes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Link href="/favorites">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Link href="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  {/* Logout */}
                  <div className="py-1">
                    <DropdownMenuItem
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onSelect={() => signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2 ">
              <Button variant="ghost" asChild>
                <Link href="/login" className="hover:text-orange-500">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register" className="hover:text-orange-500">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
