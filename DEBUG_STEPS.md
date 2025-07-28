// Add this to your .env.local for debugging
DEBUG_DATABASE=true

// Add this to your registration process to log token creation
console.log("🔍 DEBUG: About to create verification token for:", email)
const token = await generateVerificationToken(email)
console.log("✅ DEBUG: Verification token created:", token.substring(0, 10) + "...")

// Check if tokens are being created by visiting:
// http://localhost:3000/api/debug/database
