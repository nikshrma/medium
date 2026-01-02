"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { blogService } from "@/services/blog-service"
import type { Blog } from "@/types"

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{ blogId: string; action: "publish" | "unpublish" } | null>(null)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        const data = await blogService.getMyBlogs()
        setBlogs(data)
      } catch (err: any) {
        setError("Failed to load your blogs")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
  }, [])

  const handleTogglePublish = async (blog: Blog) => {
    try {
      setTogglingId(blog.id)
      const newPublishedStatus = !blog.published
      await blogService.togglePublish(blog.id, newPublishedStatus)
      setBlogs(blogs.map((b) => (b.id === blog.id ? { ...b, published: newPublishedStatus } : b)))
      setDialogState(null)
    } catch (err: any) {
      setError("Failed to toggle publish status")
      console.error(err)
    } finally {
      setTogglingId(null)
    }
  }

  const drafts = blogs.filter((b) => !b.published)
  const published = blogs.filter((b) => b.published)

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="mb-12 flex items-start justify-between gap-4 flex-col sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">Your Stories</h1>
          <p className="text-lg text-muted-foreground">Manage your draft and published stories</p>
        </div>
        <Link
          to="/write"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Write New Story
        </Link>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {blogs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-8">You haven't written anything yet</p>
          <Link
            to="/write"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Writing
          </Link>
        </div>
      )}

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Drafts ({drafts.length})</h2>
          <div className="space-y-4">
            {drafts.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-border rounded-lg p-6 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link to={`/blog/${blog.id}`} className="group">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                    Draft
                  </span>
                  <button
                    onClick={() => setDialogState({ blogId: blog.id, action: "publish" })}
                    className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    Publish
                  </button>
                  <Link
                    to={`/edit/${blog.id}`}
                    className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Published Section */}
      {published.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-foreground">Published ({published.length})</h2>
          <div className="space-y-4">
            {published.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-border rounded-lg p-6 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link to={`/blog/${blog.id}`} className="group">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-800 text-xs font-medium rounded-full border border-green-200">
                    Published
                  </span>
                  <button
                    onClick={() => setDialogState({ blogId: blog.id, action: "unpublish" })}
                    className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    Unpublish
                  </button>
                  <Link
                    to={`/edit/${blog.id}`}
                    className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmation Dialog */}
      {dialogState && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-8 max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-3 text-foreground">
              {dialogState.action === "publish" ? "Publish your story?" : "Unpublish your story?"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {dialogState.action === "publish"
                ? "Your story will be visible to all readers once published."
                : "Your story will no longer be visible to readers, but you can republish it later."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDialogState(null)}
                className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const blog = blogs.find((b) => b.id === dialogState.blogId)
                  if (blog) handleTogglePublish(blog)
                }}
                disabled={togglingId === dialogState.blogId}
                className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {togglingId === dialogState.blogId
                  ? dialogState.action === "publish"
                    ? "Publishing..."
                    : "Unpublishing..."
                  : dialogState.action === "publish"
                    ? "Publish"
                    : "Unpublish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
