import React, { useEffect } from 'react'
import Icon from './Icon.jsx'

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="presentation">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        className={`surface animate-modal-in relative w-full ${maxWidth} overflow-hidden rounded-[1.75rem] p-6 sm:p-7`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-purple-600/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{title}</h2>
            {subtitle ? <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{subtitle}</p> : null}
          </div>
          <button type="button" className="btn-icon -mr-2 -mt-1" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={19} />
          </button>
        </div>
        <div className="relative mt-6">{children}</div>
      </div>
    </div>
  )
}
