import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

const developers = [
  {
    name: "John Doe",
    role: "Frontend Developer",
    bio: "Passionate about creating beautiful and intuitive user interfaces.",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Jane Smith",
    role: "Backend Developer",
    bio: "Experienced in building scalable and efficient server-side applications.",
    skills: ["Node.js", "Python", "MongoDB"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Mike Johnson",
    role: "UI/UX Designer",
    bio: "Dedicated to creating user-centered designs that delight and inspire.",
    skills: ["Figma", "Adobe XD", "Sketch"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Sarah Lee",
    role: "Full Stack Developer",
    bio: "Versatile developer with a passion for creating end-to-end solutions.",
    skills: ["React", "Node.js", "PostgreSQL"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Alex Chen",
    role: "DevOps Engineer",
    bio: "Focused on streamlining development processes and ensuring smooth deployments.",
    skills: ["Docker", "Kubernetes", "AWS"],
    image: "/placeholder.svg?height=200&width=200",
  },
]

const DeveloperSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12"
    >
      <h2 className="text-4xl font-bold mb-8 text-center">Meet Our Developers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {developers.map((developer, index) => (
          <motion.div
            key={developer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <motion.div
              className="relative h-48 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={developer.image || "/placeholder.svg"}
                alt={developer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center">
                  <h3 className="text-xl font-semibold">{developer.name}</h3>
                  <p>{developer.role}</p>
                </div>
              </div>
            </motion.div>
            <div className="p-6">
              <p className="text-sm mb-4">{developer.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {developer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default DeveloperSection

