// dev(로컬)에서는 .env 의 VITE_API_BASE_URL 사용
// prod(빌드/EC2/nginx)에서는 same-origin(빈 문자열) 사용 → /api/... 로 요청
export const API_BASE_URL =
  import.meta.env.PROD
    ? ''                                    // 배포: nginx가 /api/를 8080으로 프록시
    : (import.meta.env.VITE_API_BASE_URL ?? '') // 로컬 개발: http://localhost:8080

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// ---- JSON 응답 공통 함수 ----
async function requestJson<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options?.token) {
    headers.Authorization = options.token
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

// ---- TEXT 응답 공통 함수 (인덱싱용) ----
async function requestText(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: { token?: string }
): Promise<string> {
  const headers: Record<string, string> = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options?.token) {
    headers.Authorization = options.token
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`)
  }

  return text
}

export const apiClient = {
  // JSON 응답
  post: <T>(path: string, body?: unknown, token?: string) =>
    requestJson<T>('POST', path, body, { token }),
  get: <T>(path: string, token?: string) =>
    requestJson<T>('GET', path, undefined, { token }),

  // TEXT 응답
  postText: (path: string, body?: unknown, token?: string) =>
    requestText('POST', path, body, { token }),
}