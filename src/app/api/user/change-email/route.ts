import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const changeEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required for security")
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { newEmail, password } = changeEmailSchema.parse(body)

    // Get the current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password if user has one (for email/password users)
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid current password" }, { status: 400 })
      }
    }

    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email address is already in use" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Generate a verification token
    // 2. Send verification email to the new email address
    // 3. Only update the email after verification
    
    // For now, we'll simulate this process
    // In production, you'd store a pending email change record
    
    // Update the email directly (in production, do this only after verification)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email: newEmail }
    })

    return NextResponse.json({ 
      message: "Email updated successfully",
      email: newEmail 
    })
  } catch (error) {
    console.error("Failed to change email:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to change email" },
      { status: 500 }
    )
  }
}
