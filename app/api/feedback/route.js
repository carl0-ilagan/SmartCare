import { NextResponse } from "next/server"
import { submitFeedback, getAllFeedback } from "@/lib/firebase"

export async function POST(request) {
  try {
    const feedbackData = await request.json()

    const feedbackId = await submitFeedback(feedbackData)

    return NextResponse.json({ id: feedbackId, success: true })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const feedback = await getAllFeedback()

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
