// 토큰으로 관리자 여부를 판단하는 헬퍼 함수
type JwtPayload = {
  sub: string
  email?: string
  userRole?: string
}

function parseJwt(bearerToken: string | null): JwtPayload | null {
  if (!bearerToken) return null

  // 백엔드에서 "Bearer xxx.yyy.zzz" 형태로 내려오니까 접두어 제거
  const token = bearerToken.startsWith('Bearer ')
  ? bearerToken.slice(7)
  : bearerToken

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    )

    return JSON.parse(jsonPayload) as JwtPayload
  } catch (e) {
    console.error('JWT 파싱 실패', e)
    return null
  }
}

function isAdminToken(bearerToken: string | null): boolean {
  const payload = parseJwt(bearerToken)
  return payload?.userRole === 'ROLE_ADMIN'
}