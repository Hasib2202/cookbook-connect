import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Get all users with basic info
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        recipes: true,
                        favorites: true,
                        ratings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Get all verification tokens
        const verificationTokens = await prisma.verificationToken.findMany({
            orderBy: { expires: 'desc' }
        })

        // Get database counts
        const counts = {
            users: await prisma.user.count(),
            recipes: await prisma.recipe.count(),
            verificationTokens: await prisma.verificationToken.count(),
            sessions: await prisma.session.count()
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            counts,
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
                createdAt: new Date(user.createdAt).toISOString(),
                recipesCount: user._count.recipes,
                favoritesCount: user._count.favorites,
                ratingsCount: user._count.ratings,
                isVerified: !!user.emailVerified
            })),
            verificationTokens: verificationTokens.map(token => ({
                identifier: token.identifier,
                token: token.token.substring(0, 8) + '...' + token.token.substring(token.token.length - 8),
                expires: new Date(token.expires).toISOString(),
                isExpired: new Date() > token.expires,
                expiresIn: Math.floor((token.expires.getTime() - new Date().getTime()) / (1000 * 60)) + ' minutes'
            }))
        })
    } catch (error) {
        console.error("Database view error:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch database info",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}
