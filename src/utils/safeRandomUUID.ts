export function safeRandomUUID(): string {
  // 브라우저 환경 & secure context 인 경우
  const c = (globalThis as any).crypto
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID()
  }

  // 그 외 (http + IP, 구형 브라우저 등)에서는 fallback
  // 간단한 랜덤 문자열로 대체 (충분히 유니크하게만 쓰면 됨)
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  )
}