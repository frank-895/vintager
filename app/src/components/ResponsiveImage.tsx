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

    const mkUrl = (w: number) => {
      const url = new URL(u.href)
      // Many setups proxy through an image optimization function; if you’ve set one up, swap here.
      // For raw storage, if you’ve enabled CDN resizing, append something like `?width=w`.
      url.searchParams.set('width', String(w))
      return url.toString()
    }

    const srcSet = [320, 480, 640, 768, 1024].map((w) => `${mkUrl(w)} ${w}w`).join(', ')
    return <img src={mkUrl(1024)} srcSet={srcSet} sizes={sizes} alt={alt} className={className} />
  } catch {
    return <img src={src} alt={alt} className={className} />
  }
}


