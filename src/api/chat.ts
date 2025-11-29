import { apiClient } from './client'
import type { ChatRequest, ChatResponse, ChatLogResponse } from '../types/api'

export function sendChat(req: ChatRequest, token?: string) {
  // token 있으면 인증 사용자, 없으면 게스트
  return apiClient.post<ChatResponse>('/api/chat', req, token)
}

// 로그인 유저의 전체 대화 로그 조회
export function fetchChatLogs(token: string) {
  return apiClient.get<ChatLogResponse[]>('/api/chat-logs', token)
}