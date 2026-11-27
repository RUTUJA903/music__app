import React from 'react'
import Icon from './Icon.jsx'
import { paletteFor } from './CoverArt.jsx'

const icons = { electronic: 'wave', jazz: 'disc', pop: 'sparkles', ambient: 'headphones', 'indie pop': 'music', 'synthwave': 'compass', 'r&b': 'heart', 'lo-fi': 'disc', alternative: 'sparkles' }

export default function GenreCard({ genre, count, onClick }) {
  const [from, to] = paletteFor({ id: genre })
  return (
    <button
      type="button"
      onClick={onClick}
      className="group surface relative min-h-[124px] overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(0,0,0,0.35)] sm:min-h-[140px]"
      aria-label={`Browse ${genre}`}
    >
      <span className="absolute inset-0 opacity-85 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} aria-hidden="true" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
      <span className="artwork-grid absolute inset-0 opacity-20" aria-hidden="true" />
      <span className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full border border-white/20 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
      <span className="relative flex h-full flex-col justify-between">
        <span className="flex items-center justify-between">
          <Icon name={icons[genre.toLowerCase()] || 'music'} size={24} className="text-white/90 transition-transform duration-300 group-hover:-rotate-12" />
          <Icon name="arrowRight" size={17} className="text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
        </span>
        <span>
          <span className="block truncate text-base font-extrabold tracking-tight text-white">{genre}</span>
          <span className="mt-0.5 block text-xs font-medium text-white/70">{count} {count === 1 ? 'track' : 'tracks'}</span>
        </span>
      </span>
    </button>
  )
}
