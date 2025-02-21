"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Dumbbell, Utensils, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import FoodCalorieTracker from "@/components/FoodCalorieTracker"
import ExerciseCalculator from "@/components/ExerciseCalculator"
import BalancedWorkoutRoutine from "@/components/BalancedWorkoutRoutine"

const tools = [
  { name: "Food Calorie Tracker", icon: Utensils },
  { name: "Exercise Calculator", icon: Dumbbell },
  { name: "Balanced Workout", icon: Activity },
]

export default function Tools() {
  const router = useRouter()
  const [activeTool, setActiveTool] = useState("Food Calorie Tracker")
  const [calorieAmount, setCalorieAmount] = useState(0)
  const [progress, setProgress] = useState(75)
  const [caloriesBurned, setCaloriesBurned] = useState(500)
  const [recentWorkout, setRecentWorkout] = useState("")
  const [userWeight, setUserWeight] = useState("") // new state for weight
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Check if user is logged in; if not, redirect to login
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
    } else {
      const user = JSON.parse(storedUser)
      if (user.weight) {
        setUserWeight(user.weight)
      }
    }
  }, [router])

  useEffect(() => {
    setMounted(true)
    // New effect: fetch target calories from database on every load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const email = JSON.parse(storedUser).email
      fetch(`/api/dashboard?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if(data.profile && data.profile.dailyCalories) {
            setCalorieAmount(data.profile.dailyCalories)
          }
        })
        .catch(err => console.error("Error fetching target calories:", err))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      const storedUser = localStorage.getItem("user")
      let email = ""
      if (storedUser) {
        email = JSON.parse(storedUser).email
      }
      const today = new Date().toISOString().split("T")[0]
      const dailyRecord = {
        date: today,
        dailyCalories: calorieAmount,
        caloriesBurned: 0
      }
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily", email, dailyRecord })
      })
    }, 5000)
    return () => clearTimeout(timer)
  }, [calorieAmount])

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedUser = localStorage.getItem("user")
      let email = ""
      if (storedUser) {
        email = JSON.parse(storedUser).email
      }
      if (email) { // Only update if user is logged in
        await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "profile",
            email,
            profileData: {
              progress,
              dailyCalories: calorieAmount,
              caloriesBurned,
              recentWorkout,
            },
          }),
        })
      }
    }, 10000)
    return () => clearInterval(interval)
  }, []) // Use an empty dependency array so the effect runs continuously

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 sm:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* New display for user weight */}
        {userWeight && (
          <div className="mb-4 text-center text-lg font-medium">
            Your Weight: {userWeight} kg
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex p-1 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md">
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={() => setActiveTool(tool.name)}
                className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                  activeTool === tool.name
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <tool.icon className="w-5 h-5 mr-2" />
                {tool.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-black rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-gray-200 dark:border-gray-800"
          >
            {activeTool === "Food Calorie Tracker" && (
              <FoodCalorieTracker calorieAmount={calorieAmount} setCalorieAmount={setCalorieAmount} />
            )}
            {activeTool === "Exercise Calculator" && (
              <ExerciseCalculator calorieAmount={calorieAmount} setCalorieAmount={setCalorieAmount} />
            )}
            {activeTool === "Balanced Workout" && (
              <BalancedWorkoutRoutine calorieAmount={calorieAmount} setCalorieAmount={setCalorieAmount} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

