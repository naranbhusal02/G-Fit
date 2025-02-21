"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Activity, Flame, Check, Play, Square, Timer, Scale } from "lucide-react"

// MET values from the Compendium of Physical Activities
const exercises = [
  {
    name: "Push-ups",
    met: 8.0, // Vigorous calisthenics
    icon: "💪",
    type: "reps",
    repsPerMinute: 20,
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Squats",
    met: 5.0, // Calisthenics, moderate
    icon: "🦵",
    type: "reps",
    repsPerMinute: 15,
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Sit-ups",
    met: 8.0, // Vigorous calisthenics
    icon: "🔄",
    type: "reps",
    repsPerMinute: 20,
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Jumping Jacks",
    met: 8.0, // Vigorous calisthenics
    icon: "⭐",
    type: "duration",
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Running",
    met: 9.8, // Running 6 mph (10 min/mile)
    icon: "🏃",
    type: "duration",
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Cycling",
    met: 7.0, // Bicycling, moderate effort
    icon: "🚴",
    type: "duration",
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Swimming",
    met: 7.0, // Swimming, moderate effort
    icon: "🏊",
    type: "duration",
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
  {
    name: "Jump Rope",
    met: 12.3, // Rope jumping
    icon: "⚡",
    type: "duration",
    intensityMultiplier: { low: 0.7, moderate: 1.0, high: 1.3 },
  },
]

export default function ExerciseCalculator({ calorieAmount, setCalorieAmount }) {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [exerciseResults, setExerciseResults] = useState([])
  const [intensity, setIntensity] = useState("moderate")
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0)
  const [workoutHistory, setWorkoutHistory] = useState([])
  const [weight, setWeight] = useState(70) // Default weight in kg
  const [currentExerciseStart, setCurrentExerciseStart] = useState(null)
  const [restStartTime, setRestStartTime] = useState(null)
  const [isResting, setIsResting] = useState(false)
  const REST_DURATION = 60 * 1000 // 60 seconds rest between exercises

  // Calculate calories burned for a specific exercise
  const calculateCaloriesBurned = useCallback(
    (exercise, durationInMinutes) => {
      // Formula: Calories = MET × Weight (kg) × Duration (hours)
      // Convert duration to hours
      const durationInHours = durationInMinutes / 60
      // Get intensity multiplier
      const intensityMult = exercise.intensityMultiplier[intensity]
      // Calculate base calories
      const baseCalories = exercise.met * weight * durationInHours
      // Apply intensity multiplier
      return baseCalories * intensityMult
    },
    [intensity, weight],
  )

  useEffect(() => {
    let timer
    if (workoutStarted && !isResting) {
      timer = setInterval(() => {
        const now = Date.now()
        const exerciseElapsed = now - currentExerciseStart
        setElapsedTime((prev) => prev + 1000) // Update total elapsed time

        // Calculate calories for current exercise
        if (selectedExercises.length > 0) {
          const currentExercise = selectedExercises[0]
          const minutesElapsed = exerciseElapsed / (1000 * 60)
          const caloriesBurned = calculateCaloriesBurned(currentExercise, minutesElapsed)
          setTotalCaloriesBurned((prev) => prev + caloriesBurned / 60) // Convert to per-second rate
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [workoutStarted, currentExerciseStart, isResting, selectedExercises, calculateCaloriesBurned])

  // Handle rest periods
  useEffect(() => {
    let restTimer
    if (isResting && restStartTime) {
      restTimer = setInterval(() => {
        const restElapsed = Date.now() - restStartTime
        if (restElapsed >= REST_DURATION) {
          setIsResting(false)
          setCurrentExerciseStart(Date.now())
        }
      }, 1000)
    }
    return () => clearInterval(restTimer)
  }, [isResting, restStartTime])

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise) ? prev.filter((ex) => ex !== exercise) : [...prev, exercise],
    )
  }

  const handleStartWorkout = () => {
    setWorkoutStarted(true)
    setStartTime(Date.now())
    setCurrentExerciseStart(Date.now())
    setElapsedTime(0)
    setTotalCaloriesBurned(0)
    setIsResting(false)
  }

  const handleNextExercise = () => {
    // Save current exercise data
    const currentExercise = selectedExercises[0]
    const exerciseDuration = (Date.now() - currentExerciseStart) / (1000 * 60) // Convert to minutes
    const caloriesBurned = calculateCaloriesBurned(currentExercise, exerciseDuration)

    // Remove completed exercise
    setSelectedExercises((prev) => prev.slice(1))

    // Start rest period
    setIsResting(true)
    setRestStartTime(Date.now())
  }

  const handleStopWorkout = async () => {
    setWorkoutStarted(false)
    const duration = Date.now() - startTime
    const finalCalories = Math.round(totalCaloriesBurned)
    // Create workout summary
    const workoutSummary = {
      date: new Date().toISOString(),
      duration: formatTime(duration),
      exercises: selectedExercises.map((ex) => ex.name),
      intensity,
      caloriesBurned: finalCalories,
      weight,
    }

    // Update DB: send total calories burned & workout summary via profile update (or extended API call)
    const storedUser = localStorage.getItem("user")
    let email = ""
    if (storedUser) {
      email = JSON.parse(storedUser).email
    }
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          email,
          profileData: {
            caloriesBurned: finalCalories,
            recentWorkout: JSON.stringify(workoutSummary)
          },
        }),
      })
      if (!response.ok) throw new Error("Failed to update workout data")
      // Optionally update parent's daily calories too
      setCalorieAmount(prev => prev + finalCalories)
      alert(`Workout recorded: ${workoutSummary.duration} and ${finalCalories} calories burned`)
    } catch (error) {
      console.error("Error updating workout data:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center text-black dark:text-white">
          <Activity className="w-6 h-6 mr-2" />
          Exercise Calculator
        </h2>
        <div className="flex items-center gap-4">
          {workoutStarted && (
            <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full">
              <Timer className="w-5 h-5 mr-2" />
              {formatTime(elapsedTime)}
            </div>
          )}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-black dark:text-white">{Math.round(totalCaloriesBurned)} cal burned</span>
          </div>
          {/* New target calories display */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
            <span className="text-black dark:text-white">Target: {calorieAmount.toFixed(2)} cal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">Your Weight (kg)</label>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-gray-500" />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                disabled={workoutStarted}
                className="w-24 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                min="30"
                max="200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">Workout Intensity</label>
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

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">Select Exercises</label>
            <div className="grid grid-cols-2 gap-2">
              {exercises.map((exercise) => (
                <button
                  key={exercise.name}
                  onClick={() => toggleExercise(exercise)}
                  disabled={workoutStarted}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    selectedExercises.includes(exercise)
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  } ${workoutStarted ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="flex items-center">
                    <span className="text-2xl mr-2">{exercise.icon}</span>
                    <span>{exercise.name}</span>
                  </span>
                  {selectedExercises.includes(exercise) && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            {!workoutStarted ? (
              <button
                onClick={handleStartWorkout}
                disabled={selectedExercises.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white font-medium
                  ${selectedExercises.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
              >
                <Play className="w-5 h-5" />
                Start Workout
              </button>
            ) : (
              <div className="flex gap-2">
                {isResting ? (
                  <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 text-white font-medium">
                    Rest Time: {Math.ceil((REST_DURATION - (Date.now() - restStartTime)) / 1000)}s
                  </div>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    disabled={selectedExercises.length <= 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
                  >
                    Next Exercise
                  </button>
                )}
                <button
                  onClick={handleStopWorkout}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  <Square className="w-5 h-5" />
                  End Workout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center text-black dark:text-white">
            <Activity className="w-5 h-5 mr-2" />
            Current Exercise
          </h3>

          {workoutStarted && selectedExercises.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{selectedExercises[0].icon}</span>
                  <span className="text-lg font-medium">{selectedExercises[0].name}</span>
                </div>
                <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  {selectedExercises[0].type === "reps"
                    ? `Target: ${selectedExercises[0].repsPerMinute * 3} reps`
                    : "Duration based"}
                </div>
              </div>
            </div>
          )}

          <h3 className="text-lg font-medium mb-4 flex items-center text-black dark:text-white">
            <Activity className="w-5 h-5 mr-2" />
            Workout History
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {workoutHistory.map((workout, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {workout.duration}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {workout.exercises.map((ex, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weight: {workout.weight}kg | Intensity: {workout.intensity}
                    </p>
                    <p className="font-bold text-green-500">{workout.caloriesBurned} cal</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {workoutHistory.length === 0 && (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                No workout history yet. Start a workout to track your progress!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

