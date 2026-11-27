import React from 'react'
import Icon from './Icon.jsx'

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[120] -translate-x-1/2 px-4 sm:bottom-28 sm:left-auto sm:right-6 sm:translate-x-0" role="status" aria-live="polite">
      <div className="surface animate-fade-up pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${isError ? 'bg-rose-500/15 text-rose-400' : 'bg-purple-500/15 text-purple-300'}`}>
          <Icon name={isError ? 'close' : 'check'} size={16} />
        </span>
        <p className="text-sm font-semibold text-white">{toast.message}</p>
        <button type="button" className="btn-icon ml-2 h-7 w-7" onClick={onDismiss} aria-label="Dismiss notification">
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  )
}
