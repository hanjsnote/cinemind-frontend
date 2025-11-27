import type { FormEvent } from 'react'

type LoginModalProps = {
  isOpen: boolean
  email: string
  password: string
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export function LoginModal({
  isOpen,
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onClose,
}: LoginModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // 모달 안 클릭은 닫히지 않게
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="modal-title">로그인</h2>

        <form className="modal-form" onSubmit={onSubmit}>
          <input
            type="email"
            className="modal-input"
            placeholder="Email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
          />
          <input
            type="password"
            className="modal-input"
            placeholder="Password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
          />

          <button type="submit" className="modal-login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}