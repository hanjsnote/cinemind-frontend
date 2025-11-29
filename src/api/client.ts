const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // 토큰 있으면 Authorization 헤더 추가
  if (options?.token) {
    headers.Authorization = `${options.token}`   
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`

    try {
      const data = await res.json()
      if ((data as any).message) {
        message = (data as any).message
      }
    } catch {
      // body 없는 에러면 그냥 status만 사용
    }

    throw new Error(message)
  }

  return (await res.json()) as T
}

export const apiClient = {
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>('POST', path, body, { token }),
  get: <T>(path: string, token?: string) =>
    request<T>('GET', path, undefined, { token }),
}