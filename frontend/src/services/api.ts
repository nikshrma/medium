import axios, { type AxiosInstance, type AxiosError } from "axios"

const API_BASE_URL ="http://localhost:3000"

class APIClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Load token from localStorage
    this.token = localStorage.getItem("authToken")
    if (this.token) {
      this.setAuthHeader()
    }

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken()
          window.location.href = "/signin"
        }
        return Promise.reject(error)
      },
    )
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem("authToken", token)
    this.setAuthHeader()
  }

  private setAuthHeader(): void {
    if (this.token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
    }
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem("authToken")
    delete this.client.defaults.headers.common["Authorization"]
  }

  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new APIClient()
export default apiClient.getClient()
