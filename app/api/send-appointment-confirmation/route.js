import { sendAppointmentConfirmation } from "@/lib/email-service"

export async function POST(request) {
  try {
    const { email, name, appointmentDetails } = await request.json()

    if (!email || !name || !appointmentDetails) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    await sendAppointmentConfirmation(email, name, appointmentDetails)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error sending appointment confirmation:", error)
    return new Response(JSON.stringify({ error: "Failed to send appointment confirmation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
