import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")
    
    const body = await request.json()
    console.log("Body received:", { ...body, password: "[HIDDEN]" })

    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("Checking for existing user...")
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("Creating user...")
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null // User needs to verify email
      }
    })

    console.log("User created successfully:", user.id)
    
    // Send verification email
    let emailSent = false
    try {
      await sendVerificationEmail(email, name)
      emailSent = true
      console.log("Verification email sent to:", email)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail registration if email fails, just log it
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user

    return NextResponse.json({
      ...userWithoutPassword,
      message: emailSent 
        ? "Registration successful! Please check your email to verify your account."
        : "Registration successful! However, we couldn't send the verification email. Please try resending it later.",
      emailSent
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}