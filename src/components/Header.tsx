type HeaderProps = {
  isLoggedIn: boolean
  isMenuOpen: boolean
  onToggleMenu: () => void
  onClickLogin: () => void
  onClickLogout: () => void
  onClearMessages: () => void
  isAdmin?: boolean
  onClickAdminTools?: () => void
}

export function Header({
  isLoggedIn,
  isMenuOpen,
  onToggleMenu,
  onClickLogin,
  onClickLogout,
  onClearMessages,
  isAdmin,
  onClickAdminTools,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="menu-wrapper">
        <button
          type="button"
          className="menu-button"
          onClick={onToggleMenu}
        >
          ···
        </button>

        {isMenuOpen && (
          <div className="menu-dropdown">
            {!isLoggedIn && (
              <button
                type="button"
                className="menu-item"
                onClick={onClickLogin}
              >
                로그인
              </button>
            )}

            {isLoggedIn && (
              <>
                {/* 관리자 계정일 떄만 노출 */}
                {isAdmin && onClickAdminTools && (
                  <button
                    type="button"
                    className="menu-item"
                    onClick={onClickAdminTools}
                  >
                    관리자 도구
                  </button>
                )}
                <button
                  type="button"
                  className="menu-item"
                  onClick={onClickLogout}
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  className="menu-item"
                  onClick={onClearMessages}
                >
                  대화 내역 삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}