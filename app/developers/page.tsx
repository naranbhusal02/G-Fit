"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"

const developers = [
  { name: "John Doe", role: "Frontend Developer", image: "/placeholder.svg?height=200&width=200" },
  { name: "Jane Smith", role: "Backend Developer", image: "/placeholder.svg?height=200&width=200" },
  { name: "Mike Johnson", role: "UI/UX Designer", image: "/placeholder.svg?height=200&width=200" },
  { name: "Sarah Lee", role: "Full Stack Developer", image: "/placeholder.svg?height=200&width=200" },
]

export default function Developers() {
  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-4"
      >
        Meet Our Team
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg mb-8"
      >
        The talented individuals behind G-Fit, working hard to bring you the best fitness experience.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {developers.map((dev, index) => (
          <motion.div
            key={dev.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">{dev.role}</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

