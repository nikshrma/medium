"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { blogService } from "@/services/blog-service"
import type { Blog } from "@/types"

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const data = await blogService.getBlogById(id)
        setBlog(data)
      } catch (err: any) {
        setError(err.response?.status === 404 ? "Blog not found" : "Failed to load blog")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id])

  const handlePublish = async () => {
    if (!blog) return

    try {
      setIsPublishing(true)
      await blogService.togglePublish(blog.id, true)
      setBlog({ ...blog, published: true })
      setShowPublishDialog(false)
      // Redirect to blog detail after publish
      setTimeout(() => navigate(`/blog/${blog.id}`), 500)
    } catch (err: any) {
      setError("Failed to publish blog")
      console.error(err)
    } finally {
      setIsPublishing(false)
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

  if (error || !blog) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600">{error || "Blog not found"}</h1>
        <Link to="/blogs" className="text-primary hover:underline mt-4 inline-block">
          ← Back to stories
        </Link>
      </div>
    )
  }

  const isOwner = user?.username === blog.authorId
  const isDraft = !blog.published

  if (isDraft && !isOwner) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold text-red-600">Blog not found</h1>
        <Link to="/blogs" className="text-primary hover:underline mt-4 inline-block">
          ← Back to stories
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Draft Badge */}
      {isDraft && (
        <div className="mb-6 inline-block bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
          Draft
        </div>
      )}

      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">{blog.title}</h1>

      {/* Metadata Bar */}
      <div className="flex items-center justify-between border-b border-border pb-8 mb-12">
        <p className="text-muted-foreground">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Author Actions */}
        {isOwner && isDraft && (
          <div className="flex gap-3">
            <Link
              to={`/edit/${blog.id}`}
              className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowPublishDialog(true)}
              className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Publish
            </button>
          </div>
        )}
      </div>

      {/* Publish Confirmation Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-8 max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-3 text-foreground">Publish your story?</h2>
            <p className="text-muted-foreground mb-8">
              Once published, your story will be visible to all readers. You can still edit it later.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPublishDialog(false)}
                className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-wrap mb-16">{blog.content}</div>

      {/* Back Link */}
      <Link to="/blogs" className="text-primary hover:underline font-medium">
        ← Back to stories
      </Link>
    </article>
  )
}
