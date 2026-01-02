"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { blogService } from "@/services/blog-service"

export default function Write() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      await blogService.createBlog({ title, content })
      navigate("/me")
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save draft")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 text-foreground">Write a story</h1>
        <p className="text-lg text-muted-foreground">Create and share your thoughts with the world</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div>
          <input
            type="text"
            placeholder="Story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="w-full text-4xl font-bold text-foreground placeholder:text-muted-foreground bg-transparent border-0 border-b-2 border-border focus:outline-none focus:border-primary pb-2 disabled:opacity-50 transition-colors"
          />
        </div>

        <div>
          <textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            rows={12}
            className="w-full text-lg font-serif text-foreground placeholder:text-muted-foreground bg-transparent border-0 focus:outline-none p-0 resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Saving..." : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/me")}
            disabled={isLoading}
            className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
