import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log("Attempting to fix VerificationToken replica identity...")
    
    // Execute the SQL to fix replica identity
    await prisma.$executeRaw`ALTER TABLE "VerificationToken" REPLICA IDENTITY FULL;`
    
    console.log("Successfully fixed VerificationToken replica identity")
    
    return NextResponse.json({
      success: true,
      message: "Fixed VerificationToken replica identity. DELETE operations should now work.",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Failed to fix replica identity:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to fix replica identity",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
