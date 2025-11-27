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
  if (options?.token) {
    headers.Authorization = 'Bearer ${options.token}'
  }

  const res = await fetch('${API_BASE_URL}${path}', {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  }) 

  if (!res.ok) {
    // 에러 메시지 파싱 시도
    let message = 'HTTP ${res.status}'
    try {
      const data = await res.json()
      if (data.message) message = data.message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return (await res.json()) as T
}

export const apiClient = {
  post: <T>(path: string, body?:unknown, token?: string) =>
    request<T>('POST', path, body, { token }),
}