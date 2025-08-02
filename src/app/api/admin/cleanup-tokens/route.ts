import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log("Cleaning up expired verification tokens...")
    
    // First, try to fix the replica identity issue
    try {
      await prisma.$executeRaw`ALTER TABLE "VerificationToken" REPLICA IDENTITY FULL;`
      console.log("Fixed replica identity for VerificationToken table")
    } catch {
      console.log("Replica identity might already be set or permissions insufficient")
    }
    
    // Get count of expired tokens before cleanup
    const expiredCount = await prisma.verificationToken.count({
      where: {
        expires: {
          lt: new Date()
        }
      }
    })
    
    // Try to delete expired tokens
    try {
      const result = await prisma.verificationToken.deleteMany({
        where: {
          expires: {
            lt: new Date()
          }
        }
      })
      
      return NextResponse.json({
        success: true,
        message: `Successfully cleaned up ${result.count} expired verification tokens`,
        expiredFound: expiredCount,
        deletedCount: result.count,
        timestamp: new Date().toISOString()
      })
    } catch {
      // If delete still fails, just return the count
      return NextResponse.json({
        success: false,
        error: "Cannot delete tokens due to replica identity issue",
        expiredFound: expiredCount,
        deletedCount: 0,
        suggestion: "Contact database administrator to run: ALTER TABLE \"VerificationToken\" REPLICA IDENTITY FULL;",
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("Cleanup failed:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to cleanup verification tokens",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
