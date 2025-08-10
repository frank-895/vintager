import ResponsiveImage from './ResponsiveImage'

export type WineCardData = {
  id: number
  name: string
  vintage: number | null
  image?: string | null
  vineyard?: string | null
  varietal?: string | null
  region?: string | null
  price?: number | string | null
  tasting_notes?: string[]
}

type Props = {
  wine: WineCardData
  isAdmin: boolean
  onEdit?: (wine: WineCardData, e: React.MouseEvent) => void
  onDelete?: (wine: WineCardData, e: React.MouseEvent) => void
}

export default function WineCard({ wine, isAdmin, onEdit, onDelete }: Props) {
  return (
    <a
      href={`/wines/${wine.id}`}
      className="group w-[260px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
    >
      <div className="relative w-full overflow-hidden bg-white">
        <div className="aspect-[1/1] w-full">
          <ResponsiveImage
            src={wine.image || '/hero_image.png'}
            alt="Wine"
            className="h-full w-full object-cover"
            sizes="(max-width: 640px) 90vw, 260px"
          />
        </div>
        {isAdmin && (
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={(e) => onEdit && onEdit(wine, e)}
              className="h-8 cursor-pointer inline-flex items-center justify-center rounded-full bg-white/90 px-3 text-xs text-[#111827] ring-1 ring-black/10 hover:bg-white"
            >
              Edit
            </button>
            <button
              onClick={(e) => onDelete && onDelete(wine, e)}
              className="h-8 w-8 cursor-pointer inline-flex items-center justify-center rounded-full bg-[color:var(--brand-primary)]/90 text-white ring-1 ring-black/10 hover:bg-[color:var(--brand-primary)]"
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-14" />
              </svg>
            </button>
          </div>
        )}
        {wine.price !== undefined && wine.price !== null && (
          <div className="absolute bottom-2 right-2 rounded-full bg-[color:var(--brand-primary)] px-3 py-1 text-[10px] sm:text-xs text-white shadow-sm">
            <span className="font-semibold">{typeof wine.price === 'number' ? `$${wine.price.toFixed(2)}` : String(wine.price)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-[#111827]">
          {wine.name} {wine.vintage ? `• ${wine.vintage}` : ''}
        </h3>
        <p className="mt-1 text-sm text-[color:var(--brand-text-muted)]">{[wine.vineyard, wine.varietal].filter(Boolean).join(' • ')}</p>
        <p className="mt-1 text-sm text-[color:var(--brand-text-muted)]">{wine.region || 'Other'}</p>
        {wine.tasting_notes && wine.tasting_notes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {wine.tasting_notes.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-[color:var(--brand-primary)]/10 px-2 py-0.5 text-xs text-[color:var(--brand-primary)]">
                {t}
              </span>
            ))}
            {wine.tasting_notes.length > 3 && (
              <span className="rounded-full bg-[color:var(--brand-primary)]/10 px-2 py-0.5 text-xs text-[color:var(--brand-primary)]">
                +{wine.tasting_notes.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  )
}


