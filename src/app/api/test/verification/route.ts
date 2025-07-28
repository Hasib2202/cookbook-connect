import { NextRequest, NextResponse } from "next/server"
import { generateVerificationToken } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Generate a test verification token
    const token = await generateVerificationToken(email)
    
    return NextResponse.json({
      message: "Test verification token created",
      email,
      token: token.substring(0, 10) + "...", // Show only first 10 chars for security
      verificationUrl: `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
    })
  } catch (error) {
    console.error("Test verification error:", error)
    return NextResponse.json(
      { error: "Failed to create test verification token" },
      { status: 500 }
    )
  }
}
