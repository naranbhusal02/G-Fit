"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Dumbbell, Heart, Play, Square, Timer } from "lucide-react"

const exercises = [
  {
    name: "Push-ups",
    caloriesPerMinute: { low: 4, moderate: 7, high: 10 },
    icon: "💪",
    type: "reps",
    repsPerMinute: 20,
  },
  { name: "Squats", caloriesPerMinute: { low: 5, moderate: 8, high: 12 }, icon: "🦵", type: "reps", repsPerMinute: 15 },
  { name: "Sit-ups", caloriesPerMinute: { low: 3, moderate: 6, high: 9 }, icon: "🔄", type: "reps", repsPerMinute: 20 },
  { name: "Jumping Jacks", caloriesPerMinute: { low: 8, moderate: 12, high: 16 }, icon: "⭐", type: "duration" },
  { name: "Running", caloriesPerMinute: { low: 10, moderate: 15, high: 20 }, icon: "🏃", type: "duration" },
  { name: "Cycling", caloriesPerMinute: { low: 7, moderate: 11, high: 15 }, icon: "🚴", type: "duration" },
  { name: "Swimming", caloriesPerMinute: { low: 9, moderate: 13, high: 17 }, icon: "🏊", type: "duration" },
  { name: "Jump Rope", caloriesPerMinute: { low: 11, moderate: 15, high: 20 }, icon: "⚡", type: "duration" },
]

const workoutTypes = {
  cardio: ["Jumping Jacks", "Running", "Cycling", "Swimming", "Jump Rope"],
  strength: ["Push-ups", "Squats", "Sit-ups"],
  flexibility: [
    { name: "Hamstring Stretch", duration: 30, intensity: "low" },
    { name: "Shoulder Stretch", duration: 30, intensity: "low" },
    { name: "Hip Flexor Stretch", duration: 30, intensity: "low" },
    { name: "Cat-Cow Stretch", reps: 10, intensity: "low" },
  ],
}

export default function BalancedWorkoutRoutine({ calorieAmount, setCalorieAmount }) {
  const [intensity, setIntensity] = useState("moderate")
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    if (calorieAmount > 0) {
      generateWorkoutPlan()
    }
  }, [calorieAmount])

  useEffect(() => {
    let timer
    if (workoutStarted && startTime) {
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime
        setElapsedTime(elapsed)
        // Calculate calories burned in real-time based on current exercise
        if (workoutPlan) {
          const currentSectionExercises = workoutPlan.sections[currentSection].exercises
          const exercise = currentSectionExercises[currentExerciseIndex]
          if (exercise && exercise.caloriesPerMinute) {
            const minutesElapsed = elapsed / (1000 * 60)
            const caloriesBurned = exercise.caloriesPerMinute[intensity] * minutesElapsed
            setTotalCaloriesBurned((prev) => prev + caloriesBurned)
          }
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [workoutStarted, startTime, currentExerciseIndex, currentSection, workoutPlan, intensity])

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  const generateWorkoutPlan = (currentIntensity = intensity) => {
    if (!calorieAmount) return

    const cardioCalories = calorieAmount * 0.5
    const strengthCalories = calorieAmount * 0.3
    const flexibilityCalories = calorieAmount * 0.2

    const cardioExercises = workoutTypes.cardio.map((name) => exercises.find((ex) => ex.name === name))
    const strengthExercises = workoutTypes.strength.map((name) => exercises.find((ex) => ex.name === name))

    const plan = {
      totalCalories: calorieAmount,
      sections: [
        {
          name: "Cardio",
          exercises: cardioExercises.map((exercise) => {
            const caloriesPerMinute = exercise.caloriesPerMinute[currentIntensity]
            const minutes = cardioCalories / cardioExercises.length / caloriesPerMinute
            return {
              ...exercise,
              amount: Math.ceil(minutes),
              unit: "minutes",
            }
          }),
        },
        {
          name: "Strength",
          exercises: strengthExercises.map((exercise) => {
            const caloriesPerMinute = exercise.caloriesPerMinute[currentIntensity]
            const minutes = strengthCalories / strengthExercises.length / caloriesPerMinute
            return {
              ...exercise,
              amount: Math.ceil(minutes * exercise.repsPerMinute),
              unit: "reps",
            }
          }),
        },
        {
          name: "Flexibility",
          exercises: workoutTypes.flexibility,
        },
      ],
    }

    setWorkoutPlan(plan)
  }

  const handleStartWorkout = () => {
    setWorkoutStarted(true)
    setStartTime(Date.now())
    setElapsedTime(0)
    setTotalCaloriesBurned(0)
    setCurrentExerciseIndex(0)
    setCurrentSection(0)
  }

  const handleNextExercise = () => {
    const currentSectionExercises = workoutPlan.sections[currentSection].exercises
    if (currentExerciseIndex < currentSectionExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    } else if (currentSection < workoutPlan.sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      setCurrentExerciseIndex(0)
    }
  }

  const handleStopWorkout = async () => {
    setWorkoutStarted(false)
    const duration = Date.now() - startTime
    const finalCalories = totalCaloriesBurned

    // Get user email from localStorage
    const storedUser = localStorage.getItem("user")
    let email = ""
    if (storedUser) {
      email = JSON.parse(storedUser).email
    }

    // Create workout summary
    const workoutSummary = {
      date: new Date().toISOString(),
      duration: formatTime(duration),
      type: "Balanced Workout",
      intensity,
      caloriesBurned: Math.round(finalCalories),
    }

    // Update dashboard data
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          caloriesBurned: Math.round(finalCalories),
          workoutSummary,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update workout data")
      }

      // Update the total calories in the parent component
      setCalorieAmount((prev) => prev + Math.round(finalCalories))
    } catch (error) {
      console.error("Error updating workout data:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center text-black dark:text-white">
          <Dumbbell className="w-6 h-6 mr-2" />
          Balanced Workout Routine
        </h2>
        <div className="flex items-center gap-4">
          {workoutStarted && (
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full">
              <Timer className="w-5 h-5 mr-2" />
              {formatTime(elapsedTime)}
            </div>
          )}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            <span className="text-black dark:text-white">{Math.round(totalCaloriesBurned)} cal burned</span>
          </div>
          {/* New target calories display */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
            <span className="text-black dark:text-white">
              Target: {workoutPlan ? workoutPlan.totalCalories.toFixed(2) : calorieAmount.toFixed(2)} cal
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Workout Intensity</label>
          <div className="grid grid-cols-3 gap-2">
            {["low", "moderate", "high"].map((level) => (
              <button
                key={level}
                onClick={() => setIntensity(level)}
                disabled={workoutStarted}
                className={`px-4 py-2 rounded-lg capitalize ${
                  intensity === level
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                } ${workoutStarted ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {workoutPlan ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                <span className="text-black dark:text-white">{workoutPlan.totalCalories.toFixed(2)} calories</span>
              </div>
              <div className="flex gap-2">
                {!workoutStarted ? (
                  <button
                    onClick={handleStartWorkout}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Play className="w-4 h-4" />
                    Start Workout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleNextExercise}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Next Exercise
                    </button>
                    <button
                      onClick={handleStopWorkout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Square className="w-4 h-4" />
                      End Workout
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {workoutPlan.sections.map((section, idx) => (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 ${
                    workoutStarted && idx === currentSection ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <h3 className="text-lg font-medium mb-3 flex items-center text-black dark:text-white">
                    <Dumbbell className="w-5 h-5 mr-2" />
                    {section.name}
                  </h3>
                  <div className="space-y-2">
                    {section.exercises.map((exercise, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 ${
                          workoutStarted && idx === currentSection && i === currentExerciseIndex
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                      >
                        <span className="flex items-center text-black dark:text-white">
                          <span className="text-2xl mr-2">{exercise.icon}</span>
                          {exercise.name}
                        </span>
                        <span className="text-sm bg-gray-200 dark:bg-gray-600 rounded-full px-3 py-1 text-black dark:text-white">
                          {exercise.amount
                            ? `${exercise.amount} ${exercise.unit}`
                            : exercise.duration
                              ? `${exercise.duration} sec`
                              : `${exercise.reps} reps`}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            Enter your target calories to generate a balanced workout plan
          </div>
        )}
      </div>
    </div>
  )
}

