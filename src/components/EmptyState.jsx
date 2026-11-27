import React from 'react'
import Icon from './Icon.jsx'

export default function EmptyState({ icon = 'music', title, description, actionLabel, onAction, compact = false }) {
  return (
    <div className={`surface flex flex-col items-center justify-center rounded-[1.75rem] px-6 text-center ${compact ? 'py-10' : 'py-16 sm:py-20'}`}>
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" aria-hidden="true" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-purple-300">
          <Icon name={icon} size={28} />
        </div>
      </div>
      <h3 className="text-lg font-extrabold tracking-tight text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">{description}</p>
      {actionLabel && onAction ? (
        <button type="button" className="btn-primary mt-6" onClick={onAction}>
          <Icon name="plus" size={16} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
