import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const local = path.resolve(process.cwd(), '.env.local')
  const rootLocal = path.resolve(process.cwd(), '..', '.env.local')
  if (fs.existsSync(local)) dotenv.config({ path: local })
  else if (fs.existsSync(rootLocal)) dotenv.config({ path: rootLocal })
}

async function main() {
  loadEnv()
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  const out = (label, res) => {
    if (res.error) console.error(`${label} ERROR:`, res.error.message)
    else console.log(`${label} OK: ${Array.isArray(res.data) ? res.data.length : 0} rows`)
  }

  console.log('Testing with URL:', url)

  const wine = await supabase.from('wine').select('id,name,region').limit(3)
  out('wine', wine)

  const notes = await supabase.from('tasting_note').select('id,tasting_note').limit(3)
  out('tasting_note', notes)

  const join = await supabase.from('wine_tast_note').select('wine_id,tasting_note_id').limit(3)
  out('wine_tast_note', join)
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})


