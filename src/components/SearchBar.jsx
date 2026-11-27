import React, { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'

export default function SearchBar({ value, onChange, onSubmit, results = [], onPlaySong, placeholder = 'Search songs or artists...' }) {
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handlePointer = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setFocused(false)
    }
    document.addEventListener('mousedown', handlePointer)
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [])

  const showSuggestions = focused && value.trim().length > 0 && results.length > 0

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setFocused(false)
          onSubmit?.()
        }}
        role="search"
      >
        <div className="search-shell surface-soft flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300">
          <Icon name="search" size={18} className="search-icon flex-none text-zinc-500 transition-colors duration-300" />
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            aria-label="Search songs or artists"
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {value ? (
            <button type="button" className="btn-icon h-6 w-6 flex-none" onClick={() => onChange('')} aria-label="Clear search">
              <Icon name="close" size={14} />
            </button>
          ) : (
            <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 sm:block">/</kbd>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div className="surface animate-fade-up absolute left-0 right-0 top-[calc(100%+0.6rem)] z-40 max-h-80 overflow-y-auto rounded-2xl p-2 shadow-2xl scroll-thin">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Top matches</p>
          {results.slice(0, 5).map((song) => (
            <button
              key={song.id}
              type="button"
              onClick={() => {
                onPlaySong?.(song)
                setFocused(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/[0.07]"
            >
              <CoverArt item={song} className="h-9 w-9 flex-none" rounded="rounded-lg" glyph={false} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{song.title}</span>
                <span className="block truncate text-xs text-zinc-500">{song.artist}</span>
              </span>
              <Icon name="play" size={14} className="flex-none text-purple-300" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setFocused(false)
              onSubmit?.()
            }}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            See all results <Icon name="arrowRight" size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
