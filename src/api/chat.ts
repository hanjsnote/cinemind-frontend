import { apiClient } from './client'
import type { ChatRequest, ChatResponse } from '../types/api'

export function sendChat(req: ChatRequest, token?: string) {
  // token 있으면 인증 사용자, 없으면 게스트
  return apiClient.post<ChatResponse>('/api/chat', req, token)
}