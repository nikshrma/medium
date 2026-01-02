"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { blogService } from "@/services/blog-service"
import type { Blog } from "@/types"

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

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

  const handleWriteClick = () => {
    if (isAuthenticated) {
      navigate("/write")
    } else {
      navigate("/signin")
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border bg-background py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground">Stay curious.</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWriteClick}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-lg"
              >
                Start Writing
              </button>
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center px-8 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-lg"
              >
                Start Reading
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Feed Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-4xl font-bold mb-12 text-foreground">Trending on Medium</h2>

        {isLoading && <p className="text-muted-foreground text-lg">Loading blogs...</p>}
        {error && <p className="text-red-600 text-lg">{error}</p>}
        {!isLoading && blogs.length === 0 && <p className="text-muted-foreground text-lg">No blogs published yet.</p>}

        {!isLoading && blogs.length > 0 && (
          <div className="space-y-12">
            {blogs.slice(0, 3).map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`}>
                <article className="border-b border-border pb-12 hover:opacity-75 transition-opacity cursor-pointer group">
                  <h3 className="text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{blog.content}</p>
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
      </section>

      {/* CTA to Blogs Feed */}
      {!isLoading && blogs.length > 0 && (
        <section className="border-t border-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Discover more stories</h2>
            <Link
              to="/blogs"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              View All Stories
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
