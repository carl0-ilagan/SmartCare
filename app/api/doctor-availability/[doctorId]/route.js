import { NextResponse } from "next/server"
import { updateDoctorAvailability, getDoctorAvailability } from "@/lib/firebase"

export async function GET(request, { params }) {
  try {
    const { doctorId } = params

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const availability = await getDoctorAvailability(doctorId)

    return NextResponse.json(availability || {})
  } catch (error) {
    console.error("Error fetching doctor availability:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { doctorId } = params
    const data = await request.json()

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    await updateDoctorAvailability(doctorId, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating doctor availability:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
