// --- Auth ---
export type SignUpRequest = {
  email: string
  password: string
}

export type SignUpResponse = {
  bearerToken: string
  id: number
  email: string
  createdAt: string | null
}

export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  bearerToken: string
}

// --- Chat ---
export type ChatRequest = {
  userQuery: string
  sessionId?: string | null
}

export type ChatResponse = {
  answer: string
  sources: string[]
}

// --- Chat Logs (history) ---
export type ChatLogResponse = {
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
  queryKeywords: string[]
  relatedMovieCodes: string[]
}