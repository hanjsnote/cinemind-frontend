import { type FormEvent, useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 채팅 입력 제출
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return

    console.log('사용자 질문:', query)
    setQuery('')
  }

  // ... 메뉴 > 로그인 클릭
  const handleLoginClick = () => {
    setIsMenuOpen(false)
    setIsLoginModalOpen(true)
  }

  // 모달 X 버튼 / 배경 클릭 시
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
    setEmail('')
    setPassword('')
  }

  // 로그인 폼 제출 (나중에 백엔드 연동)
  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      console.log('이메일/비밀번호 입력 필요')
      return
    }

    console.log('로그인 시도:', { email, password })
    // TODO: 나중에 여기서 백엔드 /api/auth/login 호출
    handleCloseLoginModal()
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
            </div>
          )}
        </div>
      </header>

      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div
          className="modal-overlay"
          onClick={handleCloseLoginModal} // 배경 클릭 시 닫기
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // 모달 안 클릭은 버블링 막기
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={handleCloseLoginModal}
            >
              ×
            </button>

            <h2 className="modal-title">로그인</h2>

            <form className="modal-form" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                className="modal-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="modal-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="modal-login-button">
                로그인
              </button>
            </form>
          </div>
        </div>
      )}

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