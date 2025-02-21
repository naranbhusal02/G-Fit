"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Home, PenToolIcon as Tools, Users, LogIn, Sun, Moon, Menu, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Tools", icon: Tools, href: "/tools" },
    { name: "About", icon: Users, href: "/about" },
    { name: "Login", icon: LogIn, href: "/login" },
  ]

  // Session state
  const [user, setUser] = useState<{ email: string; fullName?: string } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const filteredNavItems = user ? navItems.filter(item => item.name !== "Login") : navItems

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white border-opacity-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            G-Fit
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                  ${pathname === item.href ? "bg-white text-black" : "text-white hover:bg-white hover:bg-opacity-10"}`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 p-2 rounded-lg bg-white bg-opacity-10 text-white hover:bg-opacity-20"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-black text-white flex justify-center items-center"
                >
                  {user.fullName
                    ? user.fullName.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded shadow-lg">
                    <Link href="/dashboard">
                      <div className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                        Dashboard
                      </div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href ? "bg-white text-black" : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </div>
              </Link>
            ))}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setIsMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
            >
              <div className="flex items-center gap-2">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Toggle Theme
              </div>
            </button>
            {user && (
              <div className="border-t border-gray-600 pt-2">
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

