import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type WineFormValues = {
  name: string
  vintage: number | ''
  region: string
  country: string
  vineyard: string
  brand: string
  varietal: string
  volume: string
  alcohol_content: string
  price: string
  stock_level: number | ''
  light_bold: number
  smooth_tannic: number
  dry_sweet: number
  soft_acidic: number
  description: string
  image: string
  tasting_note_ids: number[]
}

type Props = {
  initial?: Partial<WineFormValues>
  onCancel: () => void
  onConfirm: () => void
}

export default function WineForm({ initial, onCancel, onConfirm }: Props) {
  const [notesOptions, setNotesOptions] = useState<{ id: number; label: string }[]>([])
  const [query, setQuery] = useState('')
  const filteredNotes = useMemo(
    () => notesOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 50),
    [notesOptions, query],
  )

  useEffect(() => {
    supabase
      .from('tasting_note')
      .select('id, tasting_note')
      .then(({ data }) => setNotesOptions((data || []).map((d: any) => ({ id: d.id, label: d.tasting_note }))))
  }, [])

  const [values, setValues] = useState<WineFormValues>({
    name: '',
    vintage: '',
    region: '',
    country: '',
    vineyard: '',
    brand: '',
    varietal: '',
    volume: '750 ml',
    alcohol_content: '13% ABV',
    price: '',
    stock_level: '',
    light_bold: 0,
    smooth_tannic: 0,
    dry_sweet: 0,
    soft_acidic: 0,
    description: '',
    image: '',
    tasting_note_ids: [],
    ...initial,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(values.image || '')
    }
  }, [imageFile, values.image])

  function set<K extends keyof WineFormValues>(key: K, val: WineFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onConfirm()
      }}
      className="space-y-6"
    >
      <p className="text-sm text-[#111827] font-medium">This is a playground app. No changes will be made.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-[#111827]">Name</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Vintage (year)</label>
          <input type="number" min={1900} max={2100} step={1} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.vintage as number | ''} onChange={(e) => set('vintage', e.target.value ? Number(e.target.value) : '')} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Region</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.region} onChange={(e) => set('region', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Country</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.country} onChange={(e) => set('country', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Vineyard</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.vineyard} onChange={(e) => set('vineyard', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Brand</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.brand} onChange={(e) => set('brand', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Varietal</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.varietal} onChange={(e) => set('varietal', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Volume (ml)</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" placeholder="750 ml" value={values.volume} onChange={(e) => set('volume', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Alcohol content (% ABV)</label>
          <input className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" placeholder="13% ABV" value={values.alcohol_content} onChange={(e) => set('alcohol_content', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Price ($)</label>
          <input type="number" min={0} step={0.01} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Stock level</label>
          <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" value={values.stock_level as number | ''} onChange={(e) => set('stock_level', e.target.value ? Number(e.target.value) : '')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-[#111827]">Light ↔ Bold</label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={values.light_bold}
            onChange={(e) => set('light_bold', Number(e.target.value))}
            className="range-brand mt-2 w-full"
            style={{ ['--percent' as any]: `${(values.light_bold / 5) * 100}%` }}
          />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Smooth ↔ Tannic</label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={values.smooth_tannic}
            onChange={(e) => set('smooth_tannic', Number(e.target.value))}
            className="range-brand mt-2 w-full"
            style={{ ['--percent' as any]: `${(values.smooth_tannic / 5) * 100}%` }}
          />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Dry ↔ Sweet</label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={values.dry_sweet}
            onChange={(e) => set('dry_sweet', Number(e.target.value))}
            className="range-brand mt-2 w-full"
            style={{ ['--percent' as any]: `${(values.dry_sweet / 5) * 100}%` }}
          />
        </div>
        <div>
          <label className="block text-sm text-[#111827]">Soft ↔ Acidic</label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={values.soft_acidic}
            onChange={(e) => set('soft_acidic', Number(e.target.value))}
            className="range-brand mt-2 w-full"
            style={{ ['--percent' as any]: `${(values.soft_acidic / 5) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#111827]">Tasting notes</label>
        <input
          className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
          placeholder="Search notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-2 max-h-40 overflow-auto rounded-lg border border-black/10 bg-white">
          <div className="flex flex-wrap gap-2 p-3">
            {filteredNotes.map((o) => {
              const selected = values.tasting_note_ids.includes(o.id)
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() =>
                    set('tasting_note_ids', selected ? values.tasting_note_ids.filter((id) => id !== o.id) : [...values.tasting_note_ids, o.id])
                  }
                  className={`rounded-full px-3 py-1 text-xs ring-1 ${
                    selected
                      ? 'bg-[color:var(--brand-primary)] text-white ring-[color:var(--brand-primary)]'
                      : 'bg-white text-[#111827] ring-black/10'
                  }`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#111827]">Image</label>
        <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-black/20 bg-white p-6 text-sm text-[color:var(--brand-text-muted)]">
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="preview" className="h-32 w-32 rounded object-cover ring-1 ring-black/10" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="wine-image-input"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setImageFile(file)
              set('image', file ? file.name : '')
            }}
          />
          <label htmlFor="wine-image-input" className="cursor-pointer rounded-full border border-black/10 px-4 py-2 hover:bg-black/5">
            Upload image
          </label>
          <span>or drag & drop here</span>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#111827]">Description</label>
        <textarea className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2" rows={4} value={values.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-full border border-black/10 px-5 py-2 text-[#111827] hover:bg-black/5">
          Cancel
        </button>
        <button type="submit" className="rounded-full bg-[color:var(--brand-primary)] px-5 py-2 text-white">
          Confirm
        </button>
      </div>

      <p className="text-xs text-[color:var(--brand-text-muted)]">
        This is a playground app. No changes will be made.
      </p>
    </form>
  )
}


