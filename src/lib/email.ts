import crypto from "crypto"
import nodemailer from "nodemailer"
import { prisma } from "@/lib/prisma"

interface EmailConfig {
  to: string
  subject: string
  html: string
}

// Create transporter for Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendEmail({ to, subject, html }: EmailConfig) {
  try {
    // In development, log to console AND send actual email
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== EMAIL SENDING ===")
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log("===================\n")
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not configured, skipping email send")
      return false
    }

    const transporter = createTransporter()

    // Send the email
    const info = await transporter.sendMail({
      from: `"CookBook Connect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent successfully:", info.messageId)
    return true

  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store the verification token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })

  return token
}

export async function sendVerificationEmail(email: string, name?: string) {
  try {
    const token = await generateVerificationToken(email)
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - CookBook Connect</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🍳 CookBook Connect</h1>
            <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Welcome to our culinary community!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name || "there"}! 👋</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for joining CookBook Connect! We're excited to have you as part of our cooking community.
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              To complete your registration and start sharing amazing recipes, please verify your email address by clicking the button below:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #ea580c, #f97316); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3); transition: all 0.3s ease;">
                ✅ Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
              <strong>Can't click the button?</strong> Copy and paste this link in your browser:
            </p>
            <p style="word-break: break-all; color: #3b82f6; font-size: 14px; background-color: #f3f4f6; padding: 12px; border-radius: 4px; margin: 10px 0 30px 0;">
              ${verificationUrl}
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
                ⏰ <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
              If you didn't create an account with CookBook Connect, you can safely ignore this email.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} CookBook Connect. Made with ❤️ for food lovers.
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `

    const success = await sendEmail({
      to: email,
      subject: "🍳 Verify your email - CookBook Connect",
      html
    })

    if (!success) {
      throw new Error("Failed to send verification email")
    }

    return true
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw error
  }
}
