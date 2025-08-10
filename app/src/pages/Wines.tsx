import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Wine } from '../types/db'
import { BRAND } from '../constants/branding'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Dialog from '../components/Dialog'
import WineForm from '../components/WineForm'
import WineCard from '../components/WineCard'

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

  // Derived data and filtering state

  // Filters & sorting state
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedVarietals, setSelectedVarietals] = useState<string[]>([])
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [notesMatchAll, setNotesMatchAll] = useState(false)
  const [vintageMin, setVintageMin] = useState<number | ''>('')
  const [vintageMax, setVintageMax] = useState<number | ''>('')
  const [priceMin, setPriceMin] = useState<number | ''>('')
  const [priceMax, setPriceMax] = useState<number | ''>('')
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'vintage_asc' | 'vintage_desc' | 'price_asc' | 'price_desc'>('name_asc')

  // Derived option sets
  const countryOptions = useMemo(() => {
    const set = new Set<string>()
    for (const w of wines) {
      const c = ((w as any).country as string | null)?.trim()
      if (c) set.add(c)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [wines])

  const tastingNoteOptions = useMemo(() => {
    const set = new Set<string>()
    for (const w of wines) {
      ;(w.tasting_notes || []).forEach((n) => set.add(n))
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [wines])

  const varietalOptions = useMemo(() => {
    const set = new Set<string>()
    for (const w of wines) {
      const v = ((w as any).varietal as string | null)?.trim()
      if (v) set.add(v)
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [wines])

  const dataExtents = useMemo(() => {
    let minPrice = Number.POSITIVE_INFINITY
    let maxPrice = 0
    let minVintage = Number.POSITIVE_INFINITY
    let maxVintage = 0
    for (const w of wines) {
      const p = Number((w as any).price)
      if (!Number.isNaN(p)) {
        if (p < minPrice) minPrice = p
        if (p > maxPrice) maxPrice = p
      }
      const v = Number((w as any).vintage)
      if (!Number.isNaN(v)) {
        if (v < minVintage) minVintage = v
        if (v > maxVintage) maxVintage = v
      }
    }
    if (!Number.isFinite(minPrice)) minPrice = 0
    if (!Number.isFinite(minVintage)) minVintage = 0
    return { minPrice, maxPrice, minVintage, maxVintage }
  }, [wines])

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    const text = searchText.trim().toLowerCase()
    const notes = new Set(selectedNotes)
    const countries = new Set(selectedCountries)
    const varietals = new Set(selectedVarietals)
    const vMin = typeof vintageMin === 'number' ? vintageMin : -Infinity
    const vMax = typeof vintageMax === 'number' ? vintageMax : Infinity
    const pMin = typeof priceMin === 'number' ? priceMin : -Infinity
    const pMax = typeof priceMax === 'number' ? priceMax : Infinity

    const matchesText = (w: WineWithNotes) => {
      if (!text) return true
      const hay = [
        (w as any).name,
        (w as any).vineyard,
        (w as any).varietal,
        (w as any).region,
        (w as any).country,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(text)
    }

    const matchesCountry = (w: WineWithNotes) => {
      if (countries.size === 0) return true
      const c = ((w as any).country as string | null)?.trim()
      return c ? countries.has(c) : countries.has('Other')
    }

    const matchesVarietal = (w: WineWithNotes) => {
      if (varietals.size === 0) return true
      const v = ((w as any).varietal as string | null)?.trim()
      return v ? varietals.has(v) : false
    }

    const matchesNotes = (w: WineWithNotes) => {
      if (notes.size === 0) return true
      const list = new Set((w.tasting_notes || []))
      if (notesMatchAll) {
        for (const n of notes) if (!list.has(n)) return false
        return true
      }
      for (const n of notes) if (list.has(n)) return true
      return false
    }

    const matchesVintage = (w: WineWithNotes) => {
      const v = Number((w as any).vintage)
      if (Number.isNaN(v)) return vMin === -Infinity && vMax === Infinity
      return v >= vMin && v <= vMax
    }

    const matchesPrice = (w: WineWithNotes) => {
      const p = Number((w as any).price)
      if (Number.isNaN(p)) return pMin === -Infinity && pMax === Infinity
      return p >= pMin && p <= pMax
    }

    const filtered = wines.filter((w) => matchesText(w) && matchesCountry(w) && matchesVarietal(w) && matchesNotes(w) && matchesVintage(w) && matchesPrice(w))

    const sorted = filtered.slice().sort((a, b) => {
      const aName = String((a as any).name || '')
      const bName = String((b as any).name || '')
      const aVintage = Number((a as any).vintage)
      const bVintage = Number((b as any).vintage)
      const aPrice = Number((a as any).price)
      const bPrice = Number((b as any).price)
      switch (sortBy) {
        case 'name_asc':
          return aName.localeCompare(bName)
        case 'name_desc':
          return bName.localeCompare(aName)
        case 'vintage_asc':
          return (aVintage || Infinity) - (bVintage || Infinity)
        case 'vintage_desc':
          return (bVintage || -Infinity) - (aVintage || -Infinity)
        case 'price_asc':
          return (aPrice || Infinity) - (bPrice || Infinity)
        case 'price_desc':
          return (bPrice || -Infinity) - (aPrice || -Infinity)
        default:
          return 0
      }
    })

    return sorted
  }, [wines, searchText, selectedCountries, selectedVarietals, selectedNotes, notesMatchAll, vintageMin, vintageMax, priceMin, priceMax, sortBy])

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, WineWithNotes[]> = {}
    for (const w of filteredAndSorted) {
      const c = ((w as any).country as string | null) ?? 'Other'
      const key = c ? String(c).trim() : 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(w)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredAndSorted])

  function clearAll() {
    setSearchText('')
    setSelectedCountries([])
    setSelectedVarietals([])
    setSelectedNotes([])
    setNotesMatchAll(false)
    setVintageMin('')
    setVintageMax('')
    setPriceMin('')
    setPriceMax('')
    setSortBy('name_asc')
  }

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
            <button
              className="rounded-full border border-[color:var(--brand-primary)] px-4 py-2 text-sm text-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary)]/10 lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              Filters
            </button>
            <p className="text-sm text-[color:var(--brand-text-muted)]">{filteredAndSorted.length} items</p>
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

        {loading && <div className="py-20 text-center text-[color:var(--brand-text-muted)]">Loading…</div>}
        {error && <div className="py-4 text-[color:var(--brand-primary)]">{error}</div>}

        {!loading && !error && wines.length === 0 && (
          <div className="py-20 text-center text-[color:var(--brand-text-muted)]">No wines found.</div>
        )}
        {!loading && !error && wines.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-auto space-y-6 rounded-2xl bg-white p-5 ring-1 ring-black/10">
                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Search</div>
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search wines, regions, grapes..."
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                  />
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Sort by</div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                  >
                    <option value="name_asc">Name (A–Z)</option>
                    <option value="name_desc">Name (Z–A)</option>
                    <option value="vintage_desc">Vintage (newest)</option>
                    <option value="vintage_asc">Vintage (oldest)</option>
                    <option value="price_asc">Price (low → high)</option>
                    <option value="price_desc">Price (high → low)</option>
                  </select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Countries</div>
                  <div className="max-h-40 overflow-auto rounded-lg border border-black/10 p-2">
                    {countryOptions.map((c) => {
                      const checked = selectedCountries.includes(c)
                      return (
                        <label key={c} className="mb-1 flex cursor-pointer items-center gap-2 text-sm text-[#111827]">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedCountries((prev) => (checked ? prev.filter((x) => x !== c) : [...prev, c]))
                            }
                          />
                          <span>{c}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Grape variety</div>
                  <div className="max-h-40 overflow-auto rounded-lg border border-black/10 p-2">
                    {varietalOptions.map((v) => {
                      const checked = selectedVarietals.includes(v)
                      return (
                        <label key={v} className="mb-1 flex cursor-pointer items-center gap-2 text-sm text-[#111827]">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedVarietals((prev) => (checked ? prev.filter((x) => x !== v) : [...prev, v]))
                            }
                          />
                          <span>{v}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Tasting notes</div>
                  <div className="flex flex-wrap gap-2">
                    {tastingNoteOptions.slice(0, 30).map((n) => {
                      const active = selectedNotes.includes(n)
                      return (
                        <button
                          key={n}
                          type="button"
                          className={`rounded-full px-3 py-1 text-xs ring-1 ${
                            active
                              ? 'bg-[color:var(--brand-primary)] text-white ring-[color:var(--brand-primary)]'
                              : 'bg-white text-[#111827] ring-black/10'
                          }`}
                          onClick={() =>
                            setSelectedNotes((prev) => (active ? prev.filter((x) => x !== n) : [...prev, n]))
                          }
                        >
                          {n}
                        </button>
                      )
                    })}
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-xs text-[#111827]">
                    <input type="checkbox" checked={notesMatchAll} onChange={(e) => setNotesMatchAll(e.target.checked)} />
                    Match all selected notes
                  </label>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Vintage</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={dataExtents.minVintage ? String(dataExtents.minVintage) : 'Min'}
                      className="rounded-lg border border-black/10 px-3 py-2"
                      value={vintageMin as number | ''}
                      onChange={(e) => setVintageMin(e.target.value ? Number(e.target.value) : '')}
                    />
                    <input
                      type="number"
                      placeholder={dataExtents.maxVintage ? String(dataExtents.maxVintage) : 'Max'}
                      className="rounded-lg border border-black/10 px-3 py-2"
                      value={vintageMax as number | ''}
                      onChange={(e) => setVintageMax(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-[#111827]">Price ($)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder={String(dataExtents.minPrice)}
                      className="rounded-lg border border-black/10 px-3 py-2"
                      value={priceMin as number | ''}
                      onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : '')}
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder={String(dataExtents.maxPrice)}
                      className="rounded-lg border border-black/10 px-3 py-2"
                      value={priceMax as number | ''}
                      onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="w-full rounded-full border border-[color:var(--brand-primary)] px-4 py-2 text-sm text-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary)]/10"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div>
              <div className="space-y-10">
                {groupedFiltered.map(([country, items]) => (
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
                          onDelete={(_wineData, e) => {
                        e.preventDefault()
                        setConfirmOpen(true)
                          }}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Filters dialog (mobile) */}
        <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" containerClassName="max-w-xl">
          <div className="space-y-6">
            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Search</div>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search wines, regions, grapes..."
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Sort by</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              >
                <option value="name_asc">Name (A–Z)</option>
                <option value="name_desc">Name (Z–A)</option>
                <option value="vintage_desc">Vintage (newest)</option>
                <option value="vintage_asc">Vintage (oldest)</option>
                <option value="price_asc">Price (low → high)</option>
                <option value="price_desc">Price (high → low)</option>
              </select>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Countries</div>
              <div className="max-h-40 overflow-auto rounded-lg border border-black/10 p-2">
                {countryOptions.map((c) => {
                  const checked = selectedCountries.includes(c)
                  return (
                    <label key={c} className="mb-1 flex cursor-pointer items-center gap-2 text-sm text-[#111827]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedCountries((prev) => (checked ? prev.filter((x) => x !== c) : [...prev, c]))
                        }
                      />
                      <span>{c}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Grape variety</div>
              <div className="max-h-40 overflow-auto rounded-lg border border-black/10 p-2">
                {varietalOptions.map((v) => {
                  const checked = selectedVarietals.includes(v)
                  return (
                    <label key={v} className="mb-1 flex cursor-pointer items-center gap-2 text-sm text-[#111827]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedVarietals((prev) => (checked ? prev.filter((x) => x !== v) : [...prev, v]))
                        }
                      />
                      <span>{v}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Tasting notes</div>
              <div className="flex flex-wrap gap-2">
                {tastingNoteOptions.slice(0, 30).map((n) => {
                  const active = selectedNotes.includes(n)
                  return (
                    <button
                      key={n}
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs ring-1 ${
                        active
                          ? 'bg-[color:var(--brand-primary)] text-white ring-[color:var(--brand-primary)]'
                          : 'bg-white text-[#111827] ring-black/10'
                      }`}
                      onClick={() => setSelectedNotes((prev) => (active ? prev.filter((x) => x !== n) : [...prev, n]))}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs text-[#111827]">
                <input type="checkbox" checked={notesMatchAll} onChange={(e) => setNotesMatchAll(e.target.checked)} />
                Match all selected notes
              </label>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Vintage</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={dataExtents.minVintage ? String(dataExtents.minVintage) : 'Min'}
                  className="rounded-lg border border-black/10 px-3 py-2"
                  value={vintageMin as number | ''}
                  onChange={(e) => setVintageMin(e.target.value ? Number(e.target.value) : '')}
                />
                <input
                  type="number"
                  placeholder={dataExtents.maxVintage ? String(dataExtents.maxVintage) : 'Max'}
                  className="rounded-lg border border-black/10 px-3 py-2"
                  value={vintageMax as number | ''}
                  onChange={(e) => setVintageMax(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-[#111827]">Price ($)</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder={String(dataExtents.minPrice)}
                  className="rounded-lg border border-black/10 px-3 py-2"
                  value={priceMin as number | ''}
                  onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : '')}
                />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder={String(dataExtents.maxPrice)}
                  className="rounded-lg border border-black/10 px-3 py-2"
                  value={priceMax as number | ''}
                  onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAll()
                  setFiltersOpen(false)
                }}
                className="w-full rounded-full border border-[color:var(--brand-primary)] px-4 py-2 text-sm text-[color:var(--brand-primary)] hover:bg-[color:var(--brand-primary)]/10"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-full bg-[color:var(--brand-primary)] px-4 py-2 text-sm text-white hover:opacity-95"
              >
                Done
              </button>
            </div>
          </div>
        </Dialog>
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


