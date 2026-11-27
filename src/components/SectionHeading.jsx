import React from 'react'
import Icon from './Icon.jsx'

export default function SectionHeading({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300/90">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">{title}</h2>
        {description ? <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{description}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="group flex items-center gap-1.5 text-xs font-bold text-zinc-400 transition-colors hover:text-white">
          {actionLabel}
          <Icon name="arrowRight" size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      ) : null}
    </div>
  )
}
