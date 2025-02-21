"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
          {Array.from({ length: 64 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black dark:text-white">G-FIT</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Transform your body. Transform your life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
              Start Now
            </button>
            <button className="px-8 py-3 border border-black text-black dark:border-white dark:text-white rounded-full font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 2,
                ease: "linear",
              }}
              className="absolute h-px bg-gradient-to-r from-transparent via-black/30 dark:via-white/30 to-transparent"
              style={{
                top: `${30 + i * 20}%`,
                width: "100%",
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="text-4xl font-bold mb-2 text-black dark:text-white">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Users</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center p-8 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="text-4xl font-bold mb-2 text-black dark:text-white">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Workout Plans</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center p-8 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="text-4xl font-bold mb-2 text-black dark:text-white">95%</div>
            <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black dark:text-white">
            Ready to start your journey?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of others who have already transformed their lives with G-Fit.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium inline-flex items-center group"
          >
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}

