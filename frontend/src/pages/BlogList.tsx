"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { blogService } from "@/services/blog-service"
import type { Blog } from "@/types"

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        const data = await blogService.getPublishedBlogs()
        setBlogs(data)
      } catch (err: any) {
        setError("Failed to load blogs")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-5xl font-bold mb-4 text-foreground">Stories</h1>
      <p className="text-lg text-muted-foreground mb-16">Discover and read the latest stories from our community.</p>

      {isLoading && <p className="text-muted-foreground text-lg">Loading blogs...</p>}
      {error && <p className="text-red-600 text-lg">{error}</p>}
      {!isLoading && blogs.length === 0 && (
        <p className="text-muted-foreground text-lg">No blogs published yet. Be the first to write!</p>
      )}

      {!isLoading && blogs.length > 0 && (
        <div className="space-y-16">
          {blogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <article className="border-b border-border pb-16 hover:opacity-75 transition-opacity cursor-pointer group">
                <h2 className="text-4xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{blog.content}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
