import type { PropsWithChildren, ReactNode } from 'react'

type DialogProps = PropsWithChildren<{
  open: boolean
  onClose: () => void
  title?: string
  titleClassName?: string
  footer?: ReactNode
  containerClassName?: string
}>

export default function Dialog({ open, onClose, title, titleClassName, children, footer, containerClassName }: DialogProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`relative z-10 w-full max-w-5xl rounded-2xl bg-white p-0 shadow-xl ring-1 ring-black/10 max-h-[85vh] overflow-y-auto ${
          containerClassName ?? ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end bg-white/90 px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-black/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6">
        {title ? <h3 className={titleClassName || 'text-lg font-semibold text-[#111827]'}>{title}</h3> : null}
          <div className="mt-3 text-sm text-[#374151]">{children}</div>
          {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}


