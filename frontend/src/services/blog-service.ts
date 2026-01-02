import api from "./api"
import type { Blog, CreateBlogRequest } from "@/types"

export const blogService = {
  // Get all published blogs (public feed)
  async getPublishedBlogs(): Promise<Blog[]> {
    const response = await api.get<Blog[]>("/api/v1/blog/bulk")
    return response.data
  },

  // Get current user's blogs (drafts + published)
  async getMyBlogs(): Promise<Blog[]> {
    const response = await api.get<Blog[]>("/api/v1/blog/bulk/me")
    return response.data
  },

  // Get single blog by ID
  async getBlogById(id: string): Promise<Blog> {
    const response = await api.get<Blog>(`/api/v1/blog/${id}`)
    return response.data
  },

  // Create new blog (draft)
  async createBlog(data: CreateBlogRequest): Promise<Blog> {
    const response = await api.post<Blog>("/api/v1/blog", data)
    return response.data
  },

  // Update blog content
  async updateBlog(id: string, data: Partial<CreateBlogRequest>): Promise<Blog> {
    const response = await api.put<Blog>("/api/v1/blog", { id, ...data })
    return response.data
  },

  // Toggle publish status
  async togglePublish(id: string, published: boolean): Promise<void> {
    await api.patch("/api/v1/blog/visibility", { id, published })
  },
}
