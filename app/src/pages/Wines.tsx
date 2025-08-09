import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Wine } from '../types/db'
import { BRAND } from '../constants/branding'
import Layout from '../components/Layout'

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
        .select('id, name, vintage, region, country, vineyard, brand, varietal, volume, alchohol_content, stock_level')

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
      const country = (w as any).country as string | null
      const key = country.trim() || 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(w)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [wines])

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
          <p className="text-sm text-[color:var(--brand-text-muted)]">{wines.length} items</p>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((w) => (
                    <a
                      key={w.id}
                      href={`/wines/${w.id}`}
                      className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src="/hero_image.png"
                            alt="Wine"
                            className="h-24 w-20 rounded-md object-cover ring-1 ring-black/5"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-medium text-[#111827]" style={{ fontFamily: 'var(--brand-font-display)' }}>
                            {w.name} {w.vintage ? `• ${w.vintage}` : ''}
                          </h3>
                          <p className="mt-1 truncate text-sm text-[color:var(--brand-text-muted)]">
                            {[w.vineyard, w.varietal].filter(Boolean).join(' • ')}
                          </p>
                          <p className="mt-1 truncate text-sm text-[color:var(--brand-text-muted)]">{w.region || 'Other'}</p>
                          {w.tasting_notes && w.tasting_notes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {w.tasting_notes.slice(0, 3).map((t) => (
                                <span key={t} className="rounded-full bg-[color:var(--brand-primary)]/10 px-2 py-0.5 text-xs text-[color:var(--brand-primary)]">
                                  {t}
                                </span>
                              ))}
                              {w.tasting_notes.length > 3 && (
                                <span className="rounded-full bg-[color:var(--brand-primary)]/10 px-2 py-0.5 text-xs text-[color:var(--brand-primary)]">
                                  +{w.tasting_notes.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
        </div>
      </div>
    </Layout>
  )
}


