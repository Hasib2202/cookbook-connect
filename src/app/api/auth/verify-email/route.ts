import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  console.log("Verification attempt:", { token: token?.substring(0, 10) + '...', email })

  if (!token || !email) {
    return NextResponse.json(
      { error: "Missing token or email" },
      { status: 400 }
    )
  }

  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    })

    console.log("Found verification token:", !!verificationToken)

    if (!verificationToken) {
      // Let's also check if there are any tokens for this email
      const allTokensForEmail = await prisma.verificationToken.findMany({
        where: { identifier: email }
      })
      console.log("All tokens for email:", allTokensForEmail.length)

      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      console.log("Token expired:", { expires: verificationToken.expires, now: new Date() })
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: token
          }
        }
      })

      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      )
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })

    console.log("User email verified successfully:", email)

    // TODO: Delete the verification token (temporarily disabled due to PostgreSQL replica identity issue)
    // await prisma.verificationToken.delete({
    //   where: {
    //     identifier_token: {
    //       identifier: email,
    //       token: token
    //     }
    //   }
    // })

    console.log("Verification token left in database (delete disabled due to PostgreSQL replica identity)")

    // Redirect to success page
    return NextResponse.redirect(new URL("/login?verified=true", request.url))

  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify email", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
