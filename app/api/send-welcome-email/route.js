import { sendWelcomeEmail } from "@/lib/email-service"

export async function POST(request) {
  try {
    const { email, name, userType } = await request.json()

    if (!email || !name || !userType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    await sendWelcomeEmail(email, name, userType)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return new Response(JSON.stringify({ error: "Failed to send welcome email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
