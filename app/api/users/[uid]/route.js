import { NextResponse } from "next/server"
import { getUserData, updateUserData } from "@/lib/firebase"

export async function GET(request, { params }) {
  try {
    const { uid } = params

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userData = await getUserData(uid)

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { uid } = params
    const data = await request.json()

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await updateUserData(uid, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
