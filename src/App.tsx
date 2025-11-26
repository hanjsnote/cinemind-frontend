import { type FormEvent, useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return

    console.log('사용자 질문:', query)
    setQuery('')
  }

  const handleLoginClick = () => {
    console.log('로그인 모달 열기 예정')
    setIsMenuOpen(false)
  }

  return (
    <div className="app">
      {/* 상단 헤더 */}
      <header className="app-header">
        <div className="menu-wrapper">
          <button
            type="button"
            className="menu-button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ···
          </button>

          {isMenuOpen && (
            <div className="menu-dropdown">
              <button
                type="button"
                className="menu-item"
                onClick={handleLoginClick}
              >
                로그인
              </button>
              {/* 나중에 로그인 상태 생기면
                  - 로그아웃
                  - 대화 내역 삭제
                  같은 메뉴도 여기 추가하면 됨 */}
            </div>
          )}
        </div>
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