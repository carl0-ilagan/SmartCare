import { NextResponse } from "next/server"
import { uploadMedicalRecord } from "@/lib/firebase"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const patientId = formData.get("patientId")
    const file = formData.get("file")
    const metadata = JSON.parse(formData.get("metadata"))

    const recordId = await uploadMedicalRecord(patientId, file, metadata)

    return NextResponse.json({ id: recordId, success: true })
  } catch (error) {
    console.error("Error uploading medical record:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
