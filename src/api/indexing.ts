import { apiClient } from './client'

// 전체 인덱싱
export function rebuildAllIndex(token: string) {
  return apiClient.postText('/api/rebuild-all', undefined, token)
}

// 신규 인덱싱
export function incrementalIndex(token: string) {
  return apiClient.postText('/api/incremental', undefined, token)
}