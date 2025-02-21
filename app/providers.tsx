"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-primary rounded-full animate-spin"
              style={{ borderTopColor: "transparent", animationDuration: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-primary rounded-full animate-spin"
                style={{ borderTopColor: "transparent", animationDuration: "1s" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <main className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</main>
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

