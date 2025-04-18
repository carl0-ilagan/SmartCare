import { NextResponse } from "next/server"
import { getAllDoctors } from "@/lib/firebase"

export async function GET() {
  try {
    const doctors = await getAllDoctors()

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
