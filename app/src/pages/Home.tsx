import { BRAND } from '../constants/branding'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

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

function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 6h8M4 18h8M12 6v4M12 14v4M20 10h-8M20 6v4M20 14v4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M10 3H5a2 2 0 0 0-2 2v5l9 9a2 2 0 0 0 2.83 0l5.34-5.34a2 2 0 0 0 0-2.83L12 3Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M9 3.6c-2 .9-3.6 3.87-3.6 8.4s1.6 7.5 3.6 8.4M15 3.6c2 .9 3.6 3.87 3.6 8.4s-1.6 7.5-3.6 8.4" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.5} />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home() {
  return (
    <Layout>
      <div
      style={{
        ['--brand-primary' as any]: BRAND.colors.primary,
        ['--brand-secondary' as any]: BRAND.colors.secondary,
        ['--brand-text-muted' as any]: BRAND.colors.textMuted,
        ['--brand-font-display' as any]: BRAND.fonts.display,
        ['--brand-font-body' as any]: BRAND.fonts.body,
        fontFamily: 'var(--brand-font-body)'
      }}
      className="text-[#111827]"
    >

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
                Manage your wine list with custom software.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <Link
                  to="/wines"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-primary)] px-7 py-3.5 text-white shadow-sm transition hover:opacity-95 w-full sm:w-auto text-center"
                >
                  Wine Menu
                </Link>
                <a
                  href="https://github.com/frank-895/vintager"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--brand-primary)] bg-white px-7 py-3.5 text-[color:var(--brand-primary)] transition hover:bg-[color:var(--brand-primary)] hover:text-white w-full sm:w-auto text-center"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub Repository
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

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
          Features
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-[color:var(--brand-text-muted)]">
          A quick look at what’s built in - but keep in mind, this app can easily be adapted to suit specific needs.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Tasting notes & styles',
              body: 'Flavor tags make profiles easy to scan.',
              Icon: TagIcon,
            },
            {
              title: 'Provenance & region',
              body: 'Region and country add context and story.',
              Icon: GlobeIcon,
            },
            {
              title: 'Vintage & varietal',
              body: 'Year and grape details shown consistently.',
              Icon: WineGlassIcon,
            },
            {
              title: 'Palate profiles',
              body: 'Light–Bold, Smooth–Tannic, Dry–Sweet, Soft–Acidic.',
              Icon: SlidersIcon,
            },
            {
              title: 'Price transparency',
              body: 'Clear, at‑a‑glance pricing on every card.',
              Icon: TagIcon,
            },
            {
              title: 'Availability & stock',
              body: 'Optional stock indicators keep staff aligned.',
              Icon: CheckIcon,
            },
            {
              title: 'Descriptions & highlights',
              body: 'Short notes for extra context and discovery.',
              Icon: MenuIcon,
            },
            {
              title: 'Advanced search & filters',
              body: 'Find by style, region, grape, and more.',
              Icon: SearchIcon,
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

      {/* Who benefits? */}
      <section id="who-benefits" className="w-full bg-white/70 border-t border-[color:var(--brand-primary)]/15">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
            Who benefits?
          </h2>
          <ul className="mt-8 space-y-8">
            <li className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)]">
                <WineGlassIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>For Sommeliers</h3>
                <p className="mt-2 max-w-3xl text-[color:var(--brand-text-muted)]">
                  Maintain a single, reliable source of truth for your entire wine list, making it easy to manage selections and
                  communicate confidently with both customers and staff.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)]">
                <MenuIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>For the Team</h3>
                <p className="mt-2 max-w-3xl text-[color:var(--brand-text-muted)]">
                  Access all the wine details you need instantly — no need to track down the sommelier for every question,
                  empowering your servers to provide better recommendations.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-primary)]/10 text-[color:var(--brand-primary)]">
                <GlobeIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>For Guests</h3>
                <p className="mt-2 max-w-3xl text-[color:var(--brand-text-muted)]">
                  Discover wines effortlessly by searching through grapes, regions, or styles, all on a sleek, mobile-friendly menu
                  designed for easy exploration.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* The Vintager Playground */}
      <section id="playground" className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
            The Vintager Playground
          </h2>
          <div className="mt-6">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 sm:p-10 shadow-md border-2 border-[color:var(--brand-primary)] text-center">
              <p className="text-[color:var(--brand-text-muted)]">
                Vintager is a playground app — this means when you add, edit, or delete wines here, no real changes are saved. It’s a safe
                place to test out all the features and see how managing a wine menu can work for your business.
              </p>
              <p className="mt-4 text-[color:var(--brand-text-muted)]">
                Log in as an admin (no login details are actually required!) to see the editing, deleting, and adding functionality. But
                remember - no changes will be made!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="w-full bg-white/70 border-t border-[color:var(--brand-primary)]/15">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl" style={{ fontFamily: 'var(--brand-font-display)' }}>
            Beyond Wine: Flexible Menus for Hospitality
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-[color:var(--brand-text-muted)]">
            Vintager isn’t just for wines — it can easily handle any menu items. This shows how custom software can be tailored to fit your
            unique hospitality needs, helping your business stand out with a digital edge.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { label: 'Beer', src: '/beer.png' },
              { label: 'Cocktails', src: '/cocktail.png' },
              { label: 'Food', src: '/food.png' },
              { label: 'Desserts', src: '/dessert.png' },
            ].map(({ label, src }) => (
              <div key={label} className="group overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--brand-secondary)]">
                  <img src={src} alt={label} className="h-full w-full object-contain p-3" />
                </div>
                <p className="mt-4 text-center font-medium text-[color:var(--brand-primary)]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>
    </Layout>
  )
}


