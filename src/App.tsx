import { type FormEvent, useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // 일단은 백엔드 연결 전이니까 콘솔로만 확인
    console.log('사용자 질문:', query)
    setQuery('')
  }

  return (
    <div className="app">
      {/* 상단 헤더 */}
      <header className="app-header">
        <button className="menu-button">···</button>

        <button className="login-button">
          로그인
        </button>
      </header>

      {/* 중앙 입력 영역 */}
      <main className="app-main">
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Cine Mind 영화 관련 정보 챗봇입니다."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="send-button">
            ▶
          </button>
        </form>
      </main>
    </div>
  )
}

export default App