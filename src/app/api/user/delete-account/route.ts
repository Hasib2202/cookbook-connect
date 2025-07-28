import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Delete user and all related data (cascading deletes should handle most relationships)
    // But let's be explicit about the order to avoid foreign key constraints
    
    // 1. Delete user's ratings
    await prisma.rating.deleteMany({
      where: { userId }
    })

    // 2. Delete user's favorites
    await prisma.favorite.deleteMany({
      where: { userId }
    })

    // 3. Delete user's recipes (this will cascade to related ratings and favorites)
    await prisma.recipe.deleteMany({
      where: { userId }
    })

    // 4. Delete user's sessions
    await prisma.session.deleteMany({
      where: { userId }
    })

    // 5. Delete user's accounts
    await prisma.account.deleteMany({
      where: { userId }
    })

    // 6. Finally, delete the user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Failed to delete account:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
