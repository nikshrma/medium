export interface User {
  id: string
  username: string
  name?: string
}

export interface Blog {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  published?: boolean
}

export interface AuthResponse {
  message: string
  token: string
}

export interface SignUpRequest {
  username: string
  password: string
  name?: string
}

export interface SignInRequest {
  username: string
  password: string
}

export interface CreateBlogRequest {
  title: string
  content: string
}

export interface UpdateBlogRequest {
  id: string
  title?: string
  content?: string
}

export interface VisibilityRequest {
  id: string
  published: boolean
}
