// 전체 인덱싱
export async function rebuildAllIndex(token: string){
  const res = await fetch('/api/rebuild-all', {
    method: 'POST',
    headers: { Authorization: token },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '전체 인덱싱 실패')
  }
  return res.text()
}

export async function incrementalIndex(token: string) {
  const res = await fetch('/api/incremental', {
    method: 'POST',
    headers: { Authorization: token },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '신규 인덱싱 실패')
  }
  return res.text()
}