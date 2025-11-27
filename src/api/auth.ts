import { apiClient } from "./client";
import type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse, 
} from '../types/api'

export function signin(req: SignInRequest) {
  return apiClient.post<SignInResponse>('/api/auth/signin', req)
}

export function signup(req: SignUpRequest) {
  return apiClient.post<SignUpResponse>('/api/auth/signup', req)
}