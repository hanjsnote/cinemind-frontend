type AdminModalProps = {
  isOpen: boolean
  onClose: () => void
  onClickRebuildAll: () => void
  onClickIncremental: () => void
  isLoading: boolean
  lastMessage: string | null
}

export function AdminModal({
  isOpen,
  onClose,
  onClickRebuildAll,
  onClickIncremental,
  isLoading,
  lastMessage,
}: AdminModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="modal-title">관리자 도구</h2>

        <p className="confirm-message">
          RAG 인덱스를 수동으로 관리할 수 있습니다.
        </p>

        <div className="modal-footer">
          <button
            type="button"
            className="confirm-ok-button"
            onClick={onClickRebuildAll}
            disabled={isLoading}
          >
            전체 영화 인덱싱
          </button>
          <button
            type="button"
            className="confirm-cancel-button"
            onClick={onClickIncremental}
            disabled={isLoading}
          >
            신규 영화 인덱싱
          </button>

          {lastMessage && (
            <p className="modal-footer-text">{lastMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}