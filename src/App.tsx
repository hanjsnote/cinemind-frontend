import { type FormEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

function App() {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // 로그인 여부 (지금은 프론트에서만 관리, 나중에 JWT 연동 예정)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 채팅 메시지 리스트
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // 로그인 폼 상태
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 스크롤을 맨 아래로 내리기 위한 ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // 응답 로딩 상태
  const [isLoading, setIsLoading] = useState(false)
  // 더미 LLM 응답용 setTimeout id 저장 (응답 중지할 때 취소용)
  const pendingTimeoutRef = useRef<number | null>(null)

  const hasMessages = messages.length > 0

  // 메시지가 추가될 때마다 자동으로 맨 아래로 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 채팅 입력 제출
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return // 이미 로딩 중이면 무시

    const userText = query.trim()
    setQuery('')

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        text: userText,
      },
    ])

    // 로딩 시작
    setIsLoading(true)

    // 기존에 남아있던 타이머가 있다면 정리
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }

    try {
      // TODO: 나중에 여기에서 실제 백엔드 /api/chat 호출
      // 지금은 더미로 1.5초 뒤에 응답 추가

      await new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: 'assistant',
              text: `LLM 응답 예시: "${userText}" 에 대한 답변입니다.`,
            },
          ])
          pendingTimeoutRef.current = null
          resolve()
        }, 1500)

        pendingTimeoutRef.current = id
      })
    } catch (err) {
      console.error('요청 중 에러 발생:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 응답 중지 버튼 핸들러
  const handleStopResponse = () => {
    if (!isLoading) return

    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }

    setIsLoading(false)
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
    // TODO: 여기서 /api/auth/login 호출하고 JWT 저장
    setIsLoggedIn(true) // 프론트 임시 로그인 처리
    handleCloseLoginModal()
  }

  // 로그아웃 (임시)
  const handleLogout = () => {
    setIsLoggedIn(false)
    setMessages([]) // 필요하면 대화 초기화
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
              {!isLoggedIn && (
                <button
                  type="button"
                  className="menu-item"
                  onClick={handleLoginClick}
                >
                  로그인
                </button>
              )}

              {isLoggedIn && (
                <>
                  <button
                    type="button"
                    className="menu-item"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                  <button
                    type="button"
                    className="menu-item"
                    onClick={() => setMessages([])}
                  >
                    대화 내역 삭제
                  </button>
                </>
              )}
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

      {/* ===== 메인 영역 ===== */}
      <main className={`app-main ${hasMessages ? 'has-messages' : ''}`}>
        {/* 메시지 리스트 */}
        {hasMessages && (
          <section className="chat-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${
                  msg.role === 'user' ? 'user' : 'assistant'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </section>
        )}

        {/* 입력창 */}
        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Cine Mind 영화 관련 정보 챗봇입니다."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading} // 로딩 중엔 입력 비활성화
          />

          {/* 로딩 중일 때만 스피너 + 중지 버튼 노출 */}
          {isLoading ? (
            <div className="chat-actions">
              <div className="spinner" />
              <button
                type="button"
                className="stop-button"
                onClick={handleStopResponse}
              >
                ■
              </button>
            </div>
          ) : (
            <button type="submit" className="send-button">
              ▶
            </button>
          )}
        </form>
      </main>
    </div>
  )
}

export default App