type Props = {
    src: string
    alt: string
    sizes?: string
    className?: string
  }
  
  // A minimal responsive image component that uses srcSet with width descriptors
  // If your images are Supabase Storage public URLs that support width params, you can plug them in here.
  export default function ResponsiveImage({ src, alt, sizes = '(max-width: 640px) 100vw, 50vw', className }: Props) {
    try {
      const u = new URL(src, typeof window !== 'undefined' ? window.location.href : 'http://localhost')
      const isSupabaseStorage = /supabase\.co\/.+\/storage\//.test(u.href)
      
      // If it's a Supabase Storage object URL, rewrite to the render endpoint for transformations
      let baseForTransforms = u
      const objectIdx = u.pathname.indexOf('/storage/v1/object/')
      if (objectIdx !== -1) {
        const afterObject = u.pathname.substring(objectIdx + '/storage/v1/object'.length)
        baseForTransforms = new URL(`/storage/v1/render/image${afterObject}`, `${u.protocol}//${u.host}`)
      }
  
      if (!isSupabaseStorage) {
        return <img src={src} alt={alt} className={className} />
      }
  
      const mkUrl = (w: number, format?: 'origin') => {
        const url = new URL(baseForTransforms.href)
        url.searchParams.set('width', String(w))
        url.searchParams.set('quality', '75')
        if (format === 'origin') {
          url.searchParams.set('format', 'origin')
        }
        return url.toString()
      }
  
      // For srcSet, don't specify format to enable automatic WebP optimization by Supabase
      const widths = [320, 480, 640, 768, 1024]
      const srcSetAuto = widths.map((w) => `${mkUrl(w)} ${w}w`).join(', ')
  
      return (
        <picture>
          {/* No explicit format param here — Supabase will auto-optimize to WebP if supported */}
          <img src={mkUrl(1024)} srcSet={srcSetAuto} sizes={sizes} alt={alt} className={className} />
        </picture>
      )
    } catch {
      return <img src={src} alt={alt} className={className} />
    }
  }
  