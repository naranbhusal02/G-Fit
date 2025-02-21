"use server"

import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

export async function POST(request: Request) {
  const { action, email, password, fullName, fitnessLevel, age, gender, phone, fitnessGoal } = await request.json()
  try {
    const client = await clientPromise
    const db = client.db("GFIT")
    const usersCollection = db.collection("users")
    if (action === "signup") {
      const existingUser = await usersCollection.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 })
      }
      // Insert new user with extended profile fields
      await usersCollection.insertOne({ email, password, fullName, fitnessLevel, age, gender, phone, fitnessGoal })
      return NextResponse.json({ message: "Signup successful" })
    } else if (action === "login") {
      const user = await usersCollection.findOne({ email, password })
      if (!user) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
      }
      // Generate a session token
      const token = crypto.randomUUID()
      return NextResponse.json({ 
        message: "Login successful", 
        token, 
        user: { email, fullName: user.fullName }
      })
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
