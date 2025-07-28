import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const totalRecipes = await prisma.recipe.count()
    const totalUsers = await prisma.user.count()
    const totalSessions = await prisma.session.count()
    const totalVerificationTokens = await prisma.verificationToken.count()
    
    // Get verification tokens
    const verificationTokens = await prisma.verificationToken.findMany({
      orderBy: { expires: 'desc' }
    })

    // Get users with verification status
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Get sessions
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: { expires: 'desc' },
      take: 5
    })

    return NextResponse.json({
      counts: {
        totalRecipes,
        totalUsers,
        totalSessions,
        totalVerificationTokens
      },
      verificationTokens: verificationTokens.map(token => ({
        identifier: token.identifier,
        token: token.token.substring(0, 10) + '...', // Show only first 10 chars for security
        expires: token.expires,
        isExpired: new Date() > token.expires
      })),
      recentUsers: users,
      recentSessions: sessions,
      message: totalUsers > 0 ? `Database has ${totalUsers} users, ${totalVerificationTokens} verification tokens, ${totalSessions} sessions` : "No users in database yet"
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      { error: "Database check failed", details: error },
      { status: 500 }
    )
  }
}
