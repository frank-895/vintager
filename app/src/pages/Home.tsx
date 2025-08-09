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
        ['--brand-primary' as any]: BRAND.colors.primary,
        ['--brand-secondary' as any]: BRAND.colors.secondary,
        ['--brand-text-muted' as any]: BRAND.colors.textMuted,
        ['--brand-font-display' as any]: BRAND.fonts.display,
        ['--brand-font-body' as any]: BRAND.fonts.body,
        fontFamily: 'var(--brand-font-body)'
      }}
      className="min-h-dvh flex flex-col bg-[color:var(--brand-secondary)] text-[#111827]"
    >
      {/* Navbar */}
      <nav className="bg-[color:var(--brand-secondary)] border-b border-[color:var(--brand-primary)]/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-5">
            <a href="#" className="text-2xl font-semibold text-[color:var(--brand-primary)]" style={{ fontFamily: 'var(--brand-font-display)' }}>
              {BRAND.appName}
            </a>
            <div className="flex items-center gap-8">
              <a href="#examples" className="text-base font-medium text-[#111827] hover:text-[color:var(--brand-primary)] transition">Wines</a>
              <a href="#admin" className="text-base font-medium text-[#111827] hover:text-[color:var(--brand-primary)] transition">Admin</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative isolate bg-[color:var(--brand-primary)]/10 border-b border-[color:var(--brand-primary)]/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="grid grid-cols-[auto_1fr] items-center gap-4 sm:gap-6 lg:gap-14">
            {/* Section 1: Text (tight width) */}
            <div className="justify-self-start max-w-xl">
              <div className="flex items-center gap-3 text-base text-[color:var(--brand-primary)]/80">
                <WineGlassIcon className="h-6 w-6" />
                <span>Playground</span>
              </div>
              <h1 className="mt-6 text-6xl sm:text-7xl tracking-tight text-[color:var(--brand-primary)]" style={{ fontFamily: 'var(--brand-font-display)', fontWeight: 700 }}>
                {BRAND.appName}
              </h1>
              <p className="mt-3 text-xl sm:text-2xl text-[#374151]">
                Explore wine lists and hospitality menus
              </p>
              <div className="mt-10 flex gap-4">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center rounded-full bg-[color:var(--brand-primary)] px-7 py-3.5 text-white shadow-sm transition hover:opacity-95"
                >
                  How it works
                </a>
                <a
                  href="#examples"
                  className="inline-flex items-center rounded-full border border-[color:var(--brand-primary)] bg-white px-7 py-3.5 text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white"
                >
                  Examples
                </a>
              </div>
            </div>
            {/* Section 2: Image (fills remaining space, centered). Hidden only under 480px */}
            <div className="flex w-full justify-center max-[479px]:hidden">
              <img
                src="/hero_image.png"
                alt="Hospitality hero"
                className="w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[260px] xl:max-w-[260px] rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
        {/* Single, unified background — no overlays */}
      </header>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
          How it works
        </h2>
        <p className="mt-4 max-w-2xl text-[color:var(--brand-text-muted)]">
          Glanceable cards make exploring easy for the team and your guests.
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
            <div key={title} className="group rounded-2xl border border-black/5 bg-white p-8 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>{title}</h3>
              </div>
              <p className="mt-4 text-[color:var(--brand-text-muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="w-full bg-white/70 border-t border-[color:var(--brand-primary)]/15">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
            Hospitality examples
          </h2>
          <p className="mt-4 max-w-2xl text-[color:var(--brand-text-muted)]">
            Flexible enough for wine, cocktails, desserts, and daily specials.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['Wines', 'Cocktails', 'Desserts', 'Daily Specials'].map((label) => (
              <div key={label} className="rounded-xl border border-black/5 bg-[color:var(--brand-secondary)] px-6 py-14 text-center font-medium text-[color:var(--brand-primary)] shadow-sm" style={{ fontFamily: 'var(--brand-font-display)' }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[color:var(--brand-primary)] text-[color:var(--brand-secondary)] border-t border-[color:var(--brand-primary)]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-base opacity-90">{BRAND.appName} — playground app</p>
            <a
              className="text-base underline-offset-4 hover:underline"
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


