import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email-service"

export async function POST(request) {
  try {
    const { email, name, userType } = await request.json()

    await sendWelcomeEmail(email, name, userType)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
