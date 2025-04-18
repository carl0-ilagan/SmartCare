import { NextResponse } from "next/server"
import { createAppointment, getAllAppointments } from "@/lib/firebase"

export async function POST(request) {
  try {
    const appointmentData = await request.json()

    const appointmentId = await createAppointment(appointmentData)

    return NextResponse.json({ id: appointmentId, success: true })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const appointments = await getAllAppointments()

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
