export type Wine = {
  id: number
  name: string
  vintage: number | null
  region: string | null
  country?: string | null
  vineyard: string | null
  brand: number | null // schema says numeric
  varietal: string | null
  volume: string | null
  alcohol_content: string | null
  stock_level: number | null
  image?: string | null
  price?: number | string | null
  light_bold?: number | null
  smooth_tannic?: number | null
  dry_sweet?: number | null
  soft_acidic?: number | null
  description?: string | number | null
}

export type TasingNote = {
  id: number
  tasting_note: string
}

export type WineTastNote = {
  wine_id: number
  tasting_note_id: number
}


