import { NextResponse } from "next/server"
import { createPrescription } from "@/lib/firebase"

export async function POST(request) {
  try {
    const prescriptionData = await request.json()

    const prescriptionId = await createPrescription(prescriptionData)

    return NextResponse.json({ id: prescriptionId, success: true })
  } catch (error) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
