"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">Medium</div>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/write"
                className="inline-flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                ✎ Write
              </Link>

              <Link to="/me" className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors">
                My Stories
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">{user?.name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
