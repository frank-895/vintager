import type { PropsWithChildren, ReactNode } from 'react'

type DialogProps = PropsWithChildren<{
  open: boolean
  onClose: () => void
  title?: string
  titleClassName?: string
  footer?: ReactNode
}>

export default function Dialog({ open, onClose, title, titleClassName, children, footer }: DialogProps) {
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
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? <h3 className={titleClassName || 'text-lg font-semibold text-[#111827]'}>{title}</h3> : null}
        <div className="mt-3 text-sm text-[#374151]">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          {footer ?? (
            <button
              onClick={onClose}
              className="rounded-full bg-[color:var(--brand-primary)] px-5 py-2 text-white transition hover:opacity-95"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


