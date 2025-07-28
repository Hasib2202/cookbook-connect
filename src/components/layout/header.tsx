"use client"

import Link from "next/link"
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
} from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-xl font-bold">CookBook Connect</span>
        </Link>

        {/* Nav links */}
        <nav className="items-center hidden space-x-6 md:flex">
          <Link href="/recipes" className="text-sm font-medium hover:text-orange-500">
            Recipes
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-orange-500">
            Categories
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
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
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback className="font-semibold text-white bg-orange-500 rounded-full">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* <span className="hidden text-sm font-medium sm:inline">
                      {session.user?.name}
                    </span> */}
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
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
