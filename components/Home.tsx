"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Activity, Heart, Zap, Target, Star } from "lucide-react"

const images = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

const features = [
  { icon: Activity, title: "Track Progress", description: "Monitor your fitness journey with detailed analytics" },
  {
    icon: Heart,
    title: "Personalized Plans",
    description: "Get custom workout and nutrition plans tailored to your goals",
  },
  { icon: Zap, title: "Instant Motivation", description: "Stay motivated with daily challenges and rewards" },
]

const quickStartSteps = [
  { title: "Set Your Goal", description: "Define your fitness objectives" },
  { title: "Create Your Profile", description: "Input your stats and preferences" },
  { title: "Get Your Plan", description: "Receive a customized workout and diet plan" },
  { title: "Start Your Journey", description: "Begin your path to a healthier you" },
]

const testimonials = [
  { name: "Sarah L.", quote: "G-Fit transformed my approach to fitness. I've never felt better!", rating: 5 },
  { name: "Mike R.", quote: "The personalized plans are game-changers. Highly recommended!", rating: 5 },
  { name: "Emily T.", quote: "Easy to use and incredibly motivating. Love the progress tracking!", rating: 4 },
]

const Home = () => {
  const [randomImage, setRandomImage] = useState(images[0])
  const [goal, setGoal] = useState("")

  useEffect(() => {
    setRandomImage(images[Math.floor(Math.random() * images.length)])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="h-full flex flex-col justify-center items-center relative overflow-hidden"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
      >
        G-Fit
      </motion.h1>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl mb-12 text-center max-w-2xl"
      >
        Your personal fitness companion for tracking calories, planning workouts, and achieving your health goals.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-12 relative"
      >
        <Image
          src={randomImage || "/placeholder.svg"}
          alt="Fitness"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <p className="text-lg font-semibold">Start your journey today!</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Join 10,000+ happy users</p>
        </motion.div>
      </motion.div>

      {/* Fitness Goal Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="w-full max-w-md mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <Target className="mr-2" /> Set Your Fitness Goal
        </h3>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Lose 10 pounds in 3 months"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={() => alert(`Goal set: ${goal}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Set Goal
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="w-full max-w-2xl mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <h3 className="text-2xl font-semibold mb-4">Quick Start Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartSteps.map((step, index) => (
            <div key={step.title} className="flex items-start">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="w-full max-w-2xl mb-12"
      >
        <h3 className="text-2xl font-semibold mb-4 text-center">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-sm mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="font-semibold">{testimonial.name}</p>
              <div className="flex mt-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
      >
        Get Started
        <ArrowRight className="ml-2" />
      </motion.button>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-[-1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </motion.div>
    </motion.div>
  )
}

export default Home

