import { BRAND } from '../constants/branding'

function WineGlassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 2h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V2Zm5 9v7m-4 4h8"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Home() {
  return (
    <div
      style={{
        // Expose brand palette as CSS variables consumable by Tailwind arbitrary values
        ['--brand-primary' as any]: BRAND.colors.primary,
        ['--brand-secondary' as any]: BRAND.colors.secondary,
        ['--brand-text-muted' as any]: BRAND.colors.textMuted,
        fontFamily: BRAND.fontFamily,
      }}
      className="min-h-dvh flex flex-col bg-[color:var(--brand-secondary)] text-[#111827]"
    >
      {/* Hero */}
      <header className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-28 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-[color:var(--brand-primary)]/80">
            <WineGlassIcon className="h-5 w-5" />
            <span>Playground</span>
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl text-[color:var(--brand-primary)]">
            {BRAND.appName}
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-[#374151]">
            A playground for exploring wine lists and hospitality menus
          </p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[color:var(--brand-text-muted)]">
            This non‑production demo showcases how teams in hospitality can explore and
            present product catalogs — from curated wine programs to seasonal menus —
            in a clean, modern format designed for discovery.
          </p>
          <div className="mt-10 flex gap-4">
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full bg-[color:var(--brand-primary)] px-6 py-3 text-white shadow-sm transition hover:opacity-95"
            >
              See how it works
            </a>
            <a
              href="#examples"
              className="inline-flex items-center rounded-full border border-[color:var(--brand-primary)] bg-white px-6 py-3 text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white"
            >
              Browse examples
            </a>
          </div>
        </div>

        {/* Subtle angled accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[color:var(--brand-primary)]/5" />
      </header>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-2xl text-[color:var(--brand-text-muted)]">
          Clear, glanceable cards help every guest and team member find what matters —
          whether that’s a glass pour, a pairing, or today’s seasonal features.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'For sommeliers',
              body:
                'Showcase curated selections, highlight provenance, and guide discovery with tasting notes and styles.',
              Icon: WineGlassIcon,
            },
            {
              title: 'For the team',
              body:
                'Give servers instant context on blends, ingredients, and specials so recommendations feel effortless.',
              Icon: MenuIcon,
            },
            {
              title: 'For guests',
              body:
                'Offer a modern, mobile‑friendly menu that makes exploring easy — by style, region, or mood.',
              Icon: MenuIcon,
            },
          ].map(({ title, body, Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-[#111827]">{title}</h3>
              </div>
              <p className="mt-3 text-[color:var(--brand-text-muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="w-full bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl">
            Hospitality examples
          </h2>
          <p className="mt-3 max-w-2xl text-[color:var(--brand-text-muted)]">
            Flexible enough for wine, cocktails, desserts, and daily specials.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['Wines', 'Cocktails', 'Desserts', 'Daily Specials'].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-black/5 bg-[color:var(--brand-secondary)] px-4 py-10 text-center font-medium text-[color:var(--brand-primary)] shadow-sm"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[color:var(--brand-primary)] text-[color:var(--brand-secondary)]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm/6 opacity-90">{BRAND.appName} — playground app</p>
            <a
              className="text-sm/6 underline-offset-4 hover:underline"
              href="https://github.com/franksnelling/vintager"
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


