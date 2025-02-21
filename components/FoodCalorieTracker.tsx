"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Utensils } from "lucide-react"
import { useRouter } from "next/navigation"

const defaultFoods = [
  { name: "Sandwich", caloriesPer100g: 250 },
  { name: "Apple", caloriesPer100g: 52 },
  { name: "Banana", caloriesPer100g: 89 },
  { name: "Milk (1 cup)", caloriesPer100g: 42 },
  { name: "Chicken Breast", caloriesPer100g: 165 },
]

export default function FoodCalorieTracker({ calorieAmount, setCalorieAmount }) {
  const router = useRouter()
  const [localCalorie, setLocalCalorie] = useState(calorieAmount)
  const [foods, setFoods] = useState(defaultFoods)
  const [selectedFoods, setSelectedFoods] = useState([])
  const [customFood, setCustomFood] = useState({ name: "", caloriesPer100g: "" })
  const [selectedFood, setSelectedFood] = useState(null)
  const [amount, setAmount] = useState("")

  useEffect(() => {
    // Initialize total calories from localStorage on mount
    const storedTotal = localStorage.getItem("totalCalories")
    if (storedTotal) {
      setCalorieAmount(Number(storedTotal))
    }
  }, [])

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch("/api/foods")
        if (!res.ok) throw new Error("Failed to fetch foods")
        const data = await res.json()
        // Assume API returns an object like { foods: [...] }
        setFoods(data.foods)
      } catch (err) {
        console.error("Error fetching foods:", err)
      }
    }
    fetchFoods()
  }, [])

  const addSelectedFood = () => {
    if (selectedFood && amount) {
      const calories = (selectedFood.caloriesPer100g * Number.parseFloat(amount)) / 100
      setSelectedFoods([...selectedFoods, { ...selectedFood, amount: Number.parseFloat(amount), calories }])
      setCalorieAmount(prev => {
        const newTotal = prev + calories
        localStorage.setItem("totalCalories", newTotal.toString())
        return newTotal
      })
      setSelectedFood(null)
      setAmount("")
    }
  }

  const removeSelectedFood = (index) => {
    const removedFood = selectedFoods[index]
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
    setCalorieAmount(prev => {
      const newTotal = prev - removedFood.calories
      localStorage.setItem("totalCalories", newTotal.toString())
      return newTotal
    })
  }

  const addCustomFood = async () => {
    if (customFood.name && customFood.caloriesPer100g) {
      try {
        const newFood = { ...customFood, caloriesPer100g: Number.parseInt(customFood.caloriesPer100g, 10) }
        const res = await fetch("/api/foods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFood)
        })
        if (!res.ok) throw new Error("Failed to add custom food")
        // Append the new food to the list displayed
        setFoods([...foods, newFood])
        setCustomFood({ name: "", caloriesPer100g: "" })
      } catch (err) {
        console.error("Error adding custom food:", err)
      }
    }
  }

  // New effect: update total calories to database every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const storedUser = localStorage.getItem("user")
      let email = ""
      if (storedUser) {
        email = JSON.parse(storedUser).email
      }
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "profile", 
          email, 
          profileData: { dailyCalories: Number(calorieAmount) }
        }),
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [calorieAmount])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-black dark:text-white">
        <Utensils className="w-6 h-6 mr-2" />
        Food Calorie Tracker
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Select Food</h3>
          <div className="relative">
            <select
              value={selectedFood ? foods.indexOf(selectedFood) : ""}
              onChange={(e) => setSelectedFood(foods[e.target.value])}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 pr-8 rounded-md mb-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a food</option>
              {foods.map((food, index) => (
                <option key={food.name} value={index}>
                  {food.name} ({food.caloriesPer100g} cal/100g)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (g)"
              className="flex-grow bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addSelectedFood}
              className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-md hover:bg-opacity-80 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Add Custom Food</h3>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={customFood.name}
              onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
              placeholder="Food name"
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={customFood.caloriesPer100g}
              onChange={(e) => setCustomFood({ ...customFood, caloriesPer100g: e.target.value })}
              placeholder="Calories per 100g"
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomFood}
              className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-md hover:bg-opacity-80 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Food
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Selected Foods</h3>
        <div className="space-y-2">
          {selectedFoods.map((food, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
            >
              <span>
                {food.name} - {food.amount}g ({food.calories.toFixed(2)} cal)
              </span>
              <button
                onClick={() => removeSelectedFood(index)}
                className="text-white dark:text-gray-800 hover:text-opacity-80"
              >
                <X size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-semibold text-black dark:text-white">Total Calories</h3>
        <motion.p
          key={calorieAmount}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-white dark:text-gray-800"
        >
          {calorieAmount.toFixed(2)}
        </motion.p>
      </div>
    </div>
  )
}

