import React from 'react'
import Icon from './Icon.jsx'

const palettes = [
  ['#A855F7', '#4C1D95'],
  ['#22D3EE', '#4338CA'],
  ['#F472B6', '#7C3AED'],
  ['#FBBF24', '#EA580C'],
  ['#34D399', '#0F766E'],
  ['#60A5FA', '#1E3A8A'],
]

function hash(value = '') {
  let total = 0
  for (let i = 0; i < value.length; i += 1) total = (total * 31 + value.charCodeAt(i)) % 100000
  return total
}

export function paletteFor(item = {}) {
  if (Array.isArray(item.colors) && item.colors.length >= 2) return item.colors
  return palettes[hash(item.id || item.name || item.title || 'sonora') % palettes.length]
}

export default function CoverArt({ item = {}, className = '', rounded = 'rounded-2xl', glyph = true, label }) {
  const [from, to] = paletteFor(item)
  const variant = hash(item.id || item.title || item.name || 'a') % 4
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div
      className={`artwork ${rounded} ${className}`}
      style={{ background: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }}
      role="img"
      aria-label={label || `${item.title || item.name || 'Album'} artwork`}
    >
      <div className="artwork-inner absolute inset-0">
        <div className="artwork-grid" />
        <div className="artwork-shape" style={{ width: '78%', aspectRatio: '1', left: '-25%', top: '-28%', background: 'rgba(255,255,255,0.42)' }} />
        <div className="artwork-shape" style={{ width: '62%', aspectRatio: '1', right: '-20%', bottom: '-26%', background: 'rgba(0,0,0,0.28)' }} />
        <div className="artwork-shape" style={{ width: '22%', aspectRatio: '1', right: '14%', top: '16%', background: 'rgba(255,255,255,0.3)' }} />

        {variant === 0 && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" aria-hidden="true">
            {[18, 30, 42, 54].map((r) => (
              <circle key={r} cx="72" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.9" />
            ))}
          </svg>
        )}
        {variant === 1 && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-5 82 C 15 40, 32 105, 52 58 S 88 22, 108 62" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" />
            <path d="M-5 92 C 15 50, 32 115, 52 68 S 88 32, 108 72" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.6" />
          </svg>
        )}
        {variant === 2 && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={`cover-gradient-${id}`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={i} x={8 + i * 8} y={64 - Math.sin(i * 0.9) * 16} width="3.5" height={Math.max(8, 20 + Math.sin(i * 0.9) * 16)} rx="2" fill={`url(#cover-gradient-${id})`} />
            ))}
          </svg>
        )}
        {variant === 3 && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-55" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 70 L28 42 L48 62 L74 28 L100 54 L100 100 L0 100Z" fill="rgba(255,255,255,0.16)" />
            <circle cx="74" cy="28" r="7" fill="rgba(255,255,255,0.5)" />
          </svg>
        )}

        {glyph && (
          <Icon
            name="music"
            size={26}
            className="absolute bottom-2.5 left-2.5 text-white/70 drop-shadow-lg"
          />
        )}
      </div>
    </div>
  )
}
