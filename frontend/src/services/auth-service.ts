import api, { apiClient } from "./api"
import type { AuthResponse, User } from "@/types"

export const authService = {
  async signup(username: string, password: string, name?: string): Promise<{ user: User; token: string }> {
    const response = await api.post<AuthResponse>("/api/v1/user/signup", { username, password, name })
    apiClient.setToken(response.data.token)
    // Extract user info from token or return basic user object
    return {
      token: response.data.token,
      user: { id: "", username, name: name || "" },
    }
  },

  async signin(username: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post<AuthResponse>("/api/v1/user/signin", { username, password })
    apiClient.setToken(response.data.token)
    return {
      token: response.data.token,
      user: { id: "", username },
    }
  },

  logout(): void {
    apiClient.clearToken()
  },
}
