import { NextResponse } from "next/server"
import { sendMessage } from "@/lib/firebase"

export async function POST(request) {
  try {
    const { senderId, receiverId, content } = await request.json()

    await sendMessage(senderId, receiverId, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
