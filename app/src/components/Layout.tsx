import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { BRAND } from '../constants/branding'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }: PropsWithChildren) {
  const { isAdmin, logout } = useAuth()
  return (
    <div
      style={{
        ['--brand-primary' as any]: BRAND.colors.primary,
        ['--brand-secondary' as any]: BRAND.colors.secondary,
        ['--brand-text-muted' as any]: BRAND.colors.textMuted,
        ['--brand-font-display' as any]: BRAND.fonts.display,
        ['--brand-font-body' as any]: BRAND.fonts.body,
        fontFamily: 'var(--brand-font-body)',
      }}
      className="min-h-dvh flex flex-col bg-[color:var(--brand-secondary)] text-[#111827]"
    >
      <nav className="bg-white border-b border-[color:var(--brand-primary)]/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-5">
            <Link to="/" className="text-2xl font-semibold text-[color:var(--brand-primary)]" style={{ fontFamily: 'var(--brand-font-display)' }}>
              {BRAND.appName}
            </Link>
            <div className="flex items-center gap-8">
              <Link to="/wines" className="text-base font-medium text-[#111827] hover:text-[color:var(--brand-primary)] transition">
                Wine Menu
              </Link>
              {isAdmin ? (
                <button
                  onClick={logout}
                  className="text-base font-medium text-[#111827] hover:text-[color:var(--brand-primary)] transition"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="text-base font-medium text-[#111827] hover:text-[color:var(--brand-primary)] transition">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto bg-[color:var(--brand-primary)] text-[color:var(--brand-secondary)] border-t border-[color:var(--brand-primary)]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-base opacity-90">{BRAND.appName} — playground app</p>
            <a
              className="text-base underline-offset-4 hover:underline"
              href="https://github.com/frank-895/vintager"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}


