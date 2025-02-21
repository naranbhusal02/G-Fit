"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Github, Linkedin, Mail, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const developers = [
  {
    name: "Narayan Bhusal",
    role: "Lead Developer || Frontend Developer",
    image: "https://iili.io/2Z7vtOQ.png",
    github: "https://github.com/naranbhusal02",
    linkedin: "https://linkedin.com/in/naranbhusal02",
    email: "mailto: contactwithnaran@proton.me",
  },
  {
    name: "Nayan Acharya",
    role: "Lead Developer || Backend Developer",
    image: "https://iili.io/2Z7vNls.jpg",
    github: "https://github.com/nayan135",
    linkedin: "https://www.linkedin.com/in/nayan135/",
    email: "nayan.acharya@gmail.com",
  },
  {
    name: "Mission Acharya",
    role: "UI/UX Designer",
    image: "https://iili.io/2yLtERR.jpg",
    github: "https://github.com/JCT-B",
    linkedin: "https://www.linkedin.com/in/dilip--acharya/",
    email: "mission.acharya@gmail.com",
  },
  {
    name: "Shasank Shrestha",
    role: "Backend Developer",
    image: "https://iili.io/2yx6cVs.png",
    github: "https://github.com/shasankshrestha",
    linkedin: "https://www.linkedin.com/in/shasank01/",
    email: "shasank.shrestha@gmail.com",
  },
  {
    name: "Rabin Chudali",
    role: "UI Designer",
    image: "https://iili.io/2yt9vbs.jpg",
    github: "https://github.com/TechnophileCracker",
    linkedin: "https://linkedin.com/in/rabin-chudali",
    email: "mailto: chudalirabin@proton.me",
  },
]

export default function About() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 sm:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            About G-Fit
          </motion.h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg"
        >
          G-Fit is a comprehensive fitness platform designed to help you achieve your health and wellness goals. Our
          team of experts in fitness, nutrition, and technology have come together to create a user-friendly and
          effective solution for your fitness journey.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg"
        >
          Whether you're just starting out or you're a seasoned fitness enthusiast, G-Fit provides personalized workout
          plans, nutrition guidance, and progress tracking to keep you motivated and on track to reach your goals.
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-2xl font-bold mt-8 mb-4"
        >
          Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-lg"
        >
          At G-Fit, our mission is to make fitness accessible, enjoyable, and sustainable for everyone. We believe that
          with the right tools and support, anyone can transform their life and achieve their fitness dreams.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-2xl font-bold mt-8 mb-4"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1.2 }}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center"
            >
              <Image
                src={dev.image || "/placeholder.svg"}
                alt={dev.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{dev.name}</h3>
              <p className="text-black dark:text-gray-400 mb-4">{dev.role}</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${dev.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

