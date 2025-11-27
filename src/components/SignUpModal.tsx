import type { FormEvent } from 'react'

type SignUpModalProps = {
  isOpen: boolean
  email: string
  password: string
  passwordConfirm: string
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
  onChangePasswordConfirm: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export function SignUpModal({
  isOpen,
  email,
  password,
  passwordConfirm,
  onChangeEmail,
  onChangePassword,
  onChangePasswordConfirm,
  onSubmit,
  onClose,
}: SignUpModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="modal-title">회원가입</h2>

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
          <input
            type="password"
            className="modal-input"
            placeholder="Password 확인"
            value={passwordConfirm}
            onChange={(e) => onChangePasswordConfirm(e.target.value)}
          />

          <button type="submit" className="modal-signup-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  )
}