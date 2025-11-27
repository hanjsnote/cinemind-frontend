import type React from 'react'

type ConfirmModalProps = {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title = '알림',
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onCancel}
        >
          ×
        </button>

        <h2 className="modal-title">{title}</h2>

        <p className="confirm-message">{message}</p>

        <div className="confirm-buttons">
          <button
            type="button"
            className="confirm-cancel-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="confirm-ok-button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}