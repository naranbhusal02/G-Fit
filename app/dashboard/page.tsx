"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Edit2, GitlabIcon as GitHub, Twitter, Instagram, Linkedin, Sun, Moon, Upload } from "lucide-react"

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    bio: "Fitness enthusiast and software developer",
    github: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    profilePic: "/placeholder.svg?height=200&width=200",
    progress: 75,
    dailyCalories: 2500,
    caloriesBurned: 500,
    recentWorkout: ""
  })

  // New state for daily record update
  const [dailyRecord, setDailyRecord] = useState({
    date: "",
    dailyCalories: "",
    caloriesBurned: ""
  })

  // Merge logged–in user's data (from localStorage) into state
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(prev => ({ 
        ...prev, 
        email: parsedUser.email,
        username: parsedUser.fullName || prev.username,
        github: parsedUser.github || prev.github,
        twitter: parsedUser.twitter || prev.twitter,
        instagram: parsedUser.instagram || prev.instagram,
        linkedin: parsedUser.linkedin || prev.linkedin
      }))
    }
    setMounted(true)
  }, [])

  // New effect: When email is available, fetch the profile from db dynamically.
  useEffect(() => {
    if (userData.email) {
      fetch(`/api/dashboard?email=${userData.email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch dashboard data")
          return res.json()
        })
        .then((data) => {
          if (data.profile) {
            setUserData(prev => ({ ...prev, ...data.profile }))
          }
          // Optionally, store dailyRecords if you plan to display/edit them later.
          // console.log("Daily Records:", data.dailyRecords)
        })
        .catch((err) => {
          console.error("Error in fetching dashboard data:", err)
        })
        .finally(() => {
          setIsLoadingData(false)
        })
    }
  }, [userData.email])

  // New useEffect to poll the database periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (userData.email) {
        fetch(`/api/dashboard?email=${userData.email}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch DB data")
            return res.json()
          })
          .then((data) => {
            if (data.profile) {
              setUserData(prev => ({
                ...prev,
                progress: data.profile.progress,
                dailyCalories: data.profile.dailyCalories,
                caloriesBurned: data.profile.caloriesBurned,
                recentWorkout: data.profile.recentWorkout,
              }))
            }
          })
          .catch((err) => console.error("Polling fetch error:", err))
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // Send updated profile to the API
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "profile", email: userData.email, profileData: userData }),
      })
      const data = await res.json()
      if (data.message === "Profile updated successfully") {
        alert("Profile updated!")
        setIsEditing(false)
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error("Error saving profile:", err)
      alert("An error occurred while saving your profile.")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserData((prevData) => ({ ...prevData, profilePic: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // New handler for daily record submission
  const handleDailySubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily", email: userData.email, dailyRecord }),
      })
      const data = await res.json()
      if (data.message === "Daily record added successfully") {
        alert("Daily record updated!")
        // Optionally clear daily form fields:
        setDailyRecord({ date: "", dailyCalories: "", caloriesBurned: "" })
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error("Error saving daily record:", err)
      alert("An error occurred while saving your daily record.")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Dashboard
          </motion.h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={userData.profilePic || "/placeholder.svg"}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                {isEditing && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-center w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h2 className="text-2xl font-bold text-center mb-2">{userData.username}</h2>
              )}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">{userData.bio}</p>
              )}
              {/* Recent Workout Plan Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recent Workout Plan
                </label>
                {isEditing ? (
                  <textarea
                    name="recentWorkout"
                    value={userData.recentWorkout}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Describe your recent workout here..."
                  />
                ) : (
                  <div className="p-2 border rounded bg-gray-50 dark:bg-gray-700">
                    {userData.recentWorkout || "No workout plan generated yet."}
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="github"
                      value={userData.github}
                      onChange={handleInputChange}
                      placeholder="GitHub username"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="twitter"
                      value={userData.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter username"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="instagram"
                      value={userData.instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram username"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="linkedin"
                      value={userData.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn username"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </>
                ) : (
                  <>
                    <a
                      href={`https://github.com/${userData.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <GitHub className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/${userData.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://instagram.com/${userData.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://linkedin.com/in/${userData.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Overall Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">{userData.progress}%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${userData.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Daily Calories</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target Calories</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="dailyCalories"
                      value={userData.dailyCalories}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-2xl font-bold">{userData.dailyCalories}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories Burned</p>
                  <p className="text-2xl font-bold">{userData.caloriesBurned}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                        Calories Burned
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {((userData.caloriesBurned / userData.dailyCalories) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                    <div
                      style={{ width: `${(userData.caloriesBurned / userData.dailyCalories) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Removed "Update Today's Data" section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

