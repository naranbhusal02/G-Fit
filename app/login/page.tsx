"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Login() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [fitnessLevel, setFitnessLevel] = useState("beginner")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [fitnessGoal, setFitnessGoal] = useState("")
  const [weight, setWeight] = useState("") // New state for weight

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const action = isLogin ? "login" : "signup"
    const body = isLogin
      ? { action, email, password }
      : { action, email, password, fullName, fitnessLevel, age, gender, phone, fitnessGoal, weight } // include weight
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        // Log response error info for debugging
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch")
      }
      const data = await res.json()
      if (isLogin && data.message === "Login successful") {
        // Store session token and user info, including weight
        localStorage.setItem("user", JSON.stringify({ token: data.token, email, fullName: data.user.fullName, weight: data.user.weight }))
        alert("Login successful!")
        router.push("/")
      } else {
        alert(data.message)
      }
    } catch (error: any) {
      console.error("Error during login:", error)
      alert("Error: " + error.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] shadow-lg"
      >
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Welcome to G-Fit</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Your journey to fitness begins here.</p>

        <div className="flex mb-6 bg-white dark:bg-[#2a2a2a] rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${
                isLogin
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
              ${
                !isLogin
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fitness Goal
                </label>
                <input
                  type="text"
                  id="fitnessGoal"
                  placeholder="e.g., weight loss, muscle gain"
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  placeholder="Enter your weight in kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fitness Level</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value="beginner"
                      checked={fitnessLevel === "beginner"}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 border-gray-300 dark:border-gray-600 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Beginner</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value="intermediate"
                      checked={fitnessLevel === "intermediate"}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 border-gray-300 dark:border-gray-600 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value="advanced"
                      checked={fitnessLevel === "advanced"}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 border-gray-300 dark:border-gray-600 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Advanced</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg transition-colors font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isLogin ? "Login" : "Start Your Fitness Journey"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="text-black dark:text-white hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-black dark:text-white hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </div>
  )
}

