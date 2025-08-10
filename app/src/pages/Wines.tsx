import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Wine } from '../types/db'
import { BRAND } from '../constants/branding'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import ResponsiveImage from '../components/ResponsiveImage'
import Dialog from '../components/Dialog'
import WineForm from '../components/WineForm'
import WineCard, { type WineCardData } from '../components/WineCard'

type WineWithNotes = Wine & { tasting_notes?: string[] }

export default function Wines() {
  const [wines, setWines] = useState<WineWithNotes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      // Fetch wines
      const { data: wineRows, error: wineError } = await supabase
        .from('wine')
        .select('id, name, vintage, region, country, vineyard, brand, varietal, volume, alcohol_content, stock_level, image, price')

      if (wineError) {
        setError(wineError.message)
        setLoading(false)
        return
      }

      // Exact table names per your schema
      const { data: noteMappings, error: mapError } = await supabase
        .from('wine_tast_note')
        .select('wine_id, tasting_note_id')

      const { data: notes, error: notesError } = await supabase
        .from('tasting_note')
        .select('id, tasting_note')

      if (mapError || notesError) {
        console.warn('Failed to load tasting notes', mapError?.message || notesError?.message)
      }

      const idToNote: Record<number, string> = {}
      ;(notes || []).forEach((n) => {
        idToNote[(n as any).id as number] = (n as any).tasting_note as string
      })

      const wineIdToNotes: Record<number, string[]> = {}
      ;(noteMappings || []).forEach((m) => {
        const wid = (m as any).wine_id as number
        const nid = (m as any).tasting_note_id as number
        if (!wineIdToNotes[wid]) wineIdToNotes[wid] = []
        const note = idToNote[nid]
        if (note) wineIdToNotes[wid].push(note)
      })

      const merged: WineWithNotes[] = (wineRows || []).map((w) => ({
        ...(w as any),
        tasting_notes: wineIdToNotes[(w as any).id as number] || [],
      }))

      setWines(merged)
      setLoading(false)
    }
    load()
  }, [])

  const winesByCountry = useMemo(() => {
    const groups: Record<string, WineWithNotes[]> = {}
    for (const w of wines) {
      const country = ((w as any).country as string | null) ?? 'Other'
      const key = country ? country.trim() : 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(w)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [wines])

  const { isAdmin } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState<false | { mode: 'create' | 'edit'; initial?: any }>(false)
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
      className="bg-[color:var(--brand-secondary)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <header className="mb-8 flex items-end justify-between">
          <h1 className="text-4xl sm:text-5xl tracking-tight text-[color:var(--brand-primary)]" style={{ fontFamily: 'var(--brand-font-display)', fontWeight: 700 }}>
            Wines
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[color:var(--brand-text-muted)]">{wines.length} items</p>
            {isAdmin && (
              <button
                onClick={() => setFormOpen({ mode: 'create' })}
                className="rounded-full bg-[color:var(--brand-primary)] px-4 py-2 text-sm text-white hover:opacity-95"
              >
                Add wine
              </button>
            )}
          </div>
        </header>

        {loading && (
          <div className="py-20 text-center text-[color:var(--brand-text-muted)]">Loading…</div>
        )}
        {error && (
          <div className="py-4 text-[color:var(--brand-primary)]">{error}</div>
        )}

        {!loading && !error && wines.length === 0 && (
          <div className="py-20 text-center text-[color:var(--brand-text-muted)]">
            No wines found.
          </div>
        )}
        {!loading && !error && wines.length > 0 && (
          <div className="space-y-10">
            {winesByCountry.map(([country, items]) => (
              <section key={country} className="border-t border-[color:var(--brand-primary)]/15 pt-8">
                <h2 className="mb-4 text-2xl font-semibold text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                  {country}
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                  {items.map((w) => (
                    <WineCard
                      key={w.id}
                      wine={{
                        id: w.id,
                        name: w.name,
                        vintage: w.vintage ?? null,
                        image: (w as any).image || null,
                        vineyard: w.vineyard || null,
                        varietal: w.varietal || null,
                        region: w.region || null,
                        price: (w as any).price ?? null,
                        tasting_notes: w.tasting_notes,
                      }}
                      isAdmin={isAdmin}
                      onEdit={async (_wine, e) => {
                        e.preventDefault()
                        const { data: full } = await supabase
                          .from('wine')
                          .select('id, name, vintage, region, country, vineyard, brand, varietal, volume, alcohol_content, stock_level, light_bold, smooth_tannic, dry_sweet, soft_acidic, description, image, price')
                          .eq('id', w.id)
                          .maybeSingle()
                        let tastingIds: number[] = []
                        const { data: maps } = await supabase
                          .from('wine_tast_note')
                          .select('tasting_note_id')
                          .eq('wine_id', w.id)
                        if (maps) tastingIds = maps.map((m: any) => m.tasting_note_id as number)
                        setFormOpen({
                          mode: 'edit',
                          initial: full
                            ? {
                                name: (full as any).name || '',
                                vintage: (full as any).vintage ?? '',
                                region: (full as any).region || '',
                                country: (full as any).country || '',
                                vineyard: (full as any).vineyard || '',
                                brand: String((full as any).brand ?? ''),
                                varietal: (full as any).varietal || '',
                                volume: (full as any).volume || '750 ml',
                                alcohol_content: (full as any).alcohol_content || '13% ABV',
                                price: typeof (full as any).price === 'number' ? String((full as any).price) : String((full as any).price || ''),
                                stock_level: (full as any).stock_level ?? '',
                                light_bold: (full as any).light_bold ?? 0,
                                smooth_tannic: (full as any).smooth_tannic ?? 0,
                                dry_sweet: (full as any).dry_sweet ?? 0,
                                soft_acidic: (full as any).soft_acidic ?? 0,
                                description: String((full as any).description ?? ''),
                                image: (full as any).image || '',
                                tasting_note_ids: tastingIds,
                              }
                            : undefined,
                        })
                      }}
                      onDelete={(wineData, e) => {
                        e.preventDefault()
                        setConfirmOpen(true)
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
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
              <button
                className="rounded-full border border-[color:var(--brand-primary)] px-5 py-2 text-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary)]/10"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-[color:var(--brand-primary)] px-5 py-2 text-white hover:opacity-95"
                onClick={() => setConfirmOpen(false)}
              >
                Delete
              </button>
            </div>
          }
        >
          This is a playground app. The delete functionality is not currently implemented.
        </Dialog>

        <Dialog
          open={!!formOpen}
          onClose={() => setFormOpen(false)}
          title={formOpen && formOpen.mode === 'edit' ? 'Edit wine' : 'Add wine'}
          containerClassName="max-w-2xl"
        >
          <WineForm initial={(formOpen && formOpen.initial) || undefined} onCancel={() => setFormOpen(false)} onConfirm={() => setFormOpen(false)} />
        </Dialog>
      </div>
    </Layout>
  )
}


