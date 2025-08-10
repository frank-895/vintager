type Props = {
  src: string
  alt: string
  sizes?: string
  className?: string
}

// A minimal responsive image component that uses srcSet with width descriptors
// If your images are Supabase Storage public URLs that support width params, you can plug them in here.
export default function ResponsiveImage({ src, alt, sizes = '(max-width: 640px) 100vw, 50vw', className }: Props) {
  // Heuristic: if the URL looks like a Supabase Storage public URL, append width params for common sizes
  // Otherwise just return the base src without srcSet.
  try {
    const u = new URL(src, typeof window !== 'undefined' ? window.location.href : 'http://localhost')
    const isSupabaseStorage = /supabase\.co\/.+\/storage\//.test(u.href)
    if (!isSupabaseStorage) {
      return <img src={src} alt={alt} className={className} />
    }

    const mkUrl = (w: number, format?: 'webp' | 'avif') => {
      const url = new URL(u.href)
      // Many setups proxy through an image optimization function; if you’ve set one up, swap here.
      // For Supabase Storage transformations, you can use width/quality/format params.
      url.searchParams.set('width', String(w))
      if (format) url.searchParams.set('format', format)
      return url.toString()
    }

    const widths = [320, 480, 640, 768, 1024]
    const srcSetWebp = widths.map((w) => `${mkUrl(w, 'webp')} ${w}w`).join(', ')
    const srcSetFallback = widths.map((w) => `${mkUrl(w)} ${w}w`).join(', ')
    return (
      <picture>
        <source type="image/webp" srcSet={srcSetWebp} sizes={sizes} />
        <img src={mkUrl(1024)} srcSet={srcSetFallback} sizes={sizes} alt={alt} className={className} />
      </picture>
    )
  } catch {
    return <img src={src} alt={alt} className={className} />
  }
}


