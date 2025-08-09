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
}

export type TasingNote = {
  id: number
  tasting_note: string
}

export type WineTastNote = {
  wine_id: number
  tasting_note_id: number
}


