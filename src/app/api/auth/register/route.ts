import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

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
        password: hashedPassword
      }
    })

    console.log("User created successfully:", user.id)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}