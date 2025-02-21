import { motion } from "framer-motion"
import { Utensils, Dumbbell, List, Sun, TrendingUp } from "lucide-react"

const tools = [
  {
    name: "Food Calorie Tracker",
    description: "Track and store your daily calorie intake with ease.",
    icon: Utensils,
  },
  {
    name: "Exercise Calculator",
    description: "Estimate calories burned based on exercise type and duration.",
    icon: Dumbbell,
  },
  {
    name: "Balanced Workout Planner",
    description: "Generate optimized routines tailored to your fitness goals.",
    icon: List,
  },
  {
    name: "Dark/Light Mode Switcher",
    description: "Customize the UI appearance to suit your preference.",
    icon: Sun,
  },
  {
    name: "Interactive Progress Tracker",
    description: "Visualize your fitness journey with engaging charts and graphs.",
    icon: TrendingUp,
  },
]

const ToolsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12"
    >
      <h2 className="text-4xl font-bold mb-8 text-center">Our Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <tool.icon className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ToolsSection

