import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { BRAND } from '../constants/branding'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { isAdmin, login, logout } = useAuth()
  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    login()
    navigate('/wines')
  }

  return (
    <Layout>
      <div
        style={{
          ['--brand-primary' as any]: BRAND.colors.primary,
          ['--brand-text-muted' as any]: BRAND.colors.textMuted,
        }}
        className="bg-[color:var(--brand-secondary)]"
      >
        <div className="mx-auto max-w-md px-6 py-16 lg:px-8">
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--brand-primary)]">Login</h1>
          <p className="mt-4 text-sm text-[color:var(--brand-text-muted)]">
            This is just a playground app. In production, access to adding, editing, or deleting wines would require an administrator login.
          </p>

          {!isAdmin ? (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
              <div>
                <label className="block text-sm text-[#111827]">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none ring-0 focus:border-[color:var(--brand-primary)]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#111827]">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 outline-none ring-0 focus:border-[color:var(--brand-primary)]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[color:var(--brand-primary)] px-6 py-3 text-white transition hover:opacity-95"
              >
                Login
              </button>
            </form>
          ) : (
            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="text-[#111827]">You are logged in.</span>
              <button
                onClick={logout}
                className="rounded-full border border-[color:var(--brand-primary)] px-6 py-3 text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}


