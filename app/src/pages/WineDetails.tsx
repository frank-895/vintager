import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Wine } from '../types/db'
import Layout from '../components/Layout'
import { BRAND } from '../constants/branding'
import ResponsiveImage from '../components/ResponsiveImage'
import { useAuth } from '../context/AuthContext'
import Dialog from '../components/Dialog'
import WineForm from '../components/WineForm'

function Scale({ labelLeft, labelRight, value }: { labelLeft: string; labelRight: string; value: number }) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0))
  const percent = (clamped / 5) * 100
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[color:var(--brand-text-muted)]">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-black/5">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-[color:var(--brand-primary)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function WineDetails() {
  const { id } = useParams()
  const [wine, setWine] = useState<Wine | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tastingNotes, setTastingNotes] = useState<string[]>([])
  const [tastingNoteIds, setTastingNoteIds] = useState<number[]>([])
  const { isAdmin } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('wine')
        .select(
          'id, name, vintage, region, country, vineyard, brand, varietal, volume, alcohol_content, stock_level, light_bold, smooth_tannic, dry_sweet, soft_acidic, description, image, price',
        )
        .eq('id', id)
        .maybeSingle()

      if (error) setError(error.message)
      setWine((data as any) || null)
      // Load tasting notes for this wine
      if (!error && data) {
        const wineId = Number((data as any).id)
        const { data: mappings, error: mapErr } = await supabase
          .from('wine_tast_note')
          .select('tasting_note_id')
          .eq('wine_id', wineId)
        if (!mapErr && mappings && mappings.length > 0) {
          const ids = mappings.map((m: any) => m.tasting_note_id as number)
          setTastingNoteIds(ids)
          const { data: notes, error: notesErr } = await supabase
            .from('tasting_note')
            .select('id, tasting_note')
            .in('id', ids)
          if (!notesErr && notes) {
            setTastingNotes(notes.map((n: any) => n.tasting_note as string))
          }
        } else {
          setTastingNotes([])
          setTastingNoteIds([])
        }
      }
      setLoading(false)
    }
    if (id) load()
  }, [id])

  return (
    <Layout>
      <div
        style={{
          ['--brand-primary' as any]: BRAND.colors.primary,
          ['--brand-secondary' as any]: BRAND.colors.secondary,
          ['--brand-text-muted' as any]: BRAND.colors.textMuted,
          ['--brand-font-display' as any]: BRAND.fonts.display,
          ['--brand-font-body' as any]: BRAND.fonts.body,
          fontFamily: 'var(--brand-font-body)',
        }}
        className="bg-[color:var(--brand-secondary)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="mb-6 flex items-center justify-between text-sm">
            <Link to="/wines" className="text-[color:var(--brand-primary)] underline-offset-4 hover:underline">
              ← Back to wines
            </Link>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormOpen(true)}
                  className="h-8 cursor-pointer inline-flex items-center justify-center rounded-full bg-white/90 px-3 text-xs text-[#111827] ring-1 ring-black/10 hover:bg-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="h-8 w-8 cursor-pointer inline-flex items-center justify-center rounded-full bg-[color:var(--brand-primary)]/90 text-white ring-1 ring-black/10 hover:bg-[color:var(--brand-primary)]"
                  aria-label="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-14" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {loading && <div className="py-20 text-center text-[color:var(--brand-text-muted)]">Loading…</div>}
          {error && <div className="py-4 text-[color:var(--brand-primary)]">{error}</div>}
          {!loading && !error && wine && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[320px_1fr]">
              <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 max-w-full xs:max-w-none mx-auto xs:mx-0 self-start lg:self-center">
                <div className="w-full h-96 xs:h-96 sm:h-96 lg:h-96">
                  <ResponsiveImage
                    src={wine.image || '/hero_image.png'}
                    alt={wine.name}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 90vw, 320px"
                  />
                </div>
                {wine.price !== undefined && wine.price !== null && (
                  <div className="absolute bottom-3 right-3 rounded-full bg-[color:var(--brand-primary)] px-4 py-2 text-white shadow-sm">
                    <span className="text-sm font-semibold">
                      {typeof wine.price === 'number' ? `$${wine.price.toFixed(2)}` : String(wine.price)}
                    </span>
                  </div>
                )}
              </div>
              <div className="self-start">
                <h1 className="text-4xl font-semibold tracking-tight text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                  {wine.name} {wine.vintage ? `• ${wine.vintage}` : ''}
                </h1>
                <p className="mt-2 text-[color:var(--brand-text-muted)]">{[wine.vineyard, wine.varietal].filter(Boolean).join(' • ')}</p>
                <p className="mt-1 text-[color:var(--brand-text-muted)]">{[wine.region, wine.country].filter(Boolean).join(', ')}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                    <p className="text-xs text-[color:var(--brand-text-muted)]">Volume</p>
                    <p className="text-sm font-medium">{wine.volume || '—'}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                    <p className="text-xs text-[color:var(--brand-text-muted)]">Alcohol</p>
                    <p className="text-sm font-medium">{wine.alcohol_content || '—'}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                    <p className="text-xs text-[color:var(--brand-text-muted)]">Stock</p>
                    <p className="text-sm font-medium">{wine.stock_level ?? '—'}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                    <p className="text-xs text-[color:var(--brand-text-muted)]">Brand</p>
                    <p className="text-sm font-medium">{wine.brand ?? '—'}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Scale labelLeft="Light" labelRight="Bold" value={Number(wine.light_bold ?? 0)} />
                  <Scale labelLeft="Smooth" labelRight="Tannic" value={Number(wine.smooth_tannic ?? 0)} />
                  <Scale labelLeft="Dry" labelRight="Sweet" value={Number(wine.dry_sweet ?? 0)} />
                  <Scale labelLeft="Soft" labelRight="Acidic" value={Number(wine.soft_acidic ?? 0)} />
                </div>

                {tastingNotes.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                      Tasting notes
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tastingNotes.map((t) => (
                        <span key={t} className="rounded-full bg-[color:var(--brand-primary)]/10 px-3 py-1 text-xs text-[color:var(--brand-primary)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h2 className="text-lg font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                    Description
                  </h2>
                  <p className="mt-2 text-[color:var(--brand-text-muted)]">{String(wine.description ?? '—')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="No changes will be made."
          titleClassName="text-lg font-semibold text-[color:var(--brand-primary)]"
          footer={
            <div className="flex gap-3">
              <button className="rounded-full border border-[color:var(--brand-primary)] px-5 py-2 text-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary)]/10" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button className="rounded-full bg-[color:var(--brand-primary)] px-5 py-2 text-white hover:opacity-95" onClick={() => setConfirmOpen(false)}>
                Delete
              </button>
            </div>
          }
        >
          This is a playground app. The delete functionality is not currently implemented.
        </Dialog>
        <Dialog open={formOpen} onClose={() => setFormOpen(false)} title="Edit wine" containerClassName="max-w-2xl">
          {wine && (
            <WineForm
              initial={{
                name: wine.name,
                vintage: wine.vintage ?? '',
                region: wine.region || '',
                country: wine.country || '',
                vineyard: wine.vineyard || '',
                brand: String(wine.brand ?? ''),
                varietal: wine.varietal || '',
                volume: wine.volume || '750 ml',
                alcohol_content: wine.alcohol_content || '13% ABV',
                price: typeof (wine as any).price === 'number' ? String((wine as any).price) : String((wine as any).price || ''),
                stock_level: wine.stock_level ?? '',
                light_bold: wine.light_bold ?? 0,
                smooth_tannic: wine.smooth_tannic ?? 0,
                dry_sweet: wine.dry_sweet ?? 0,
                soft_acidic: wine.soft_acidic ?? 0,
                description: String(wine.description ?? ''),
                image: (wine as any)?.image || '',
                tasting_note_ids: tastingNoteIds,
              }}
              onCancel={() => setFormOpen(false)}
              onConfirm={() => setFormOpen(false)}
            />
          )}
        </Dialog>
      </div>
    </Layout>
  )
}


