import { sendPrescriptionNotification } from "@/lib/email-service"

export async function POST(request) {
  try {
    const { email, name, prescriptionDetails } = await request.json()

    if (!email || !name || !prescriptionDetails) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    await sendPrescriptionNotification(email, name, prescriptionDetails)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error sending prescription notification:", error)
    return new Response(JSON.stringify({ error: "Failed to send prescription notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
