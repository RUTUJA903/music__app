import React from 'react'

export default function Equalizer({ active = true, className = '', barClassName = '' }) {
  return (
    <span className={`inline-flex h-4 items-end gap-[2px] ${active ? '' : 'eq-paused'} ${className}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`eq-bar ${barClassName}`} style={{ height: active ? undefined : '35%', animationDelay: `${i * 110}ms` }} />
      ))}
    </span>
  )
}
