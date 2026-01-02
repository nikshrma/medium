"use client"

import type React from "react"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { useAuth } from "@/contexts/AuthContext"
import Navigation from "@/components/Navigation"
import Home from "@/pages/Home"
import BlogList from "@/pages/BlogList"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"
import BlogDetail from "@/pages/BlogDetail"
import Write from "@/pages/Write"
import MyBlogs from "@/pages/MyBlogs"
import EditBlog from "@/pages/EditBlog"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route
        path="/write"
        element={
          <ProtectedRoute>
            <Write />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
