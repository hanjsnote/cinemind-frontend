type HeaderProps = {
  isLoggedIn: boolean
  isMenuOpen: boolean
  onToggleMenu: () => void
  onClickLogin: () => void
  onClickLogout: () => void
  onClearMessages: () => void
}

export function Header({
  isLoggedIn,
  isMenuOpen,
  onToggleMenu,
  onClickLogin,
  onClickLogout,
  onClearMessages,
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