"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { blogService } from "@/services/blog-service"

export default function EditBlog() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const blog = await blogService.getBlogById(id)

        if (blog.authorId !== user?.username) {
          setError("You can only edit your own blogs")
          return
        }

        setTitle(blog.title)
        setContent(blog.content)
      } catch (err: any) {
        setError("Failed to load blog")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id, user?.username])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    try {
      setIsSaving(true)
      setError("")
      await blogService.updateBlog(id, { title, content })
      navigate(`/blog/${id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update blog")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <svg
            className="w-8 h-8 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    )
  }

  if (error && isLoading === false && !title) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
        <button
          onClick={() => navigate("/me")}
          className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
        >
          Back to my blogs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 text-foreground">Edit story</h1>
        <p className="text-lg text-muted-foreground">Update your story content</p>
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
            disabled={isSaving}
            className="w-full text-4xl font-bold text-foreground placeholder:text-muted-foreground bg-transparent border-0 border-b-2 border-border focus:outline-none focus:border-primary pb-2 disabled:opacity-50 transition-colors"
          />
        </div>

        <div>
          <textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
            rows={12}
            className="w-full text-lg font-serif text-foreground placeholder:text-muted-foreground bg-transparent border-0 focus:outline-none p-0 resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blog/${id}`)}
            disabled={isSaving}
            className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
