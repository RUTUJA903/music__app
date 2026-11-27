import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'
import { formatTime } from '../utils/format.js'

export default function SongCard({ song, isActive = false, isPlaying = false, onPlay, onAddToPlaylist, isLiked = false, onToggleLike }) {
  return (
    <article className={`surface cover-tile group relative min-w-0 overflow-hidden rounded-[1.5rem] p-3 ${isActive ? 'ring-1 ring-purple-400/50' : ''}`}>
      <div className="relative">
        <CoverArt item={song} className="aspect-square w-full" rounded="rounded-2xl" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/65 via-transparent to-transparent" aria-hidden="true" />
        <button
          type="button"
          onClick={() => onPlay(song)}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-white opacity-0 shadow-xl transition-all duration-200 hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
          aria-label={`Play ${song.title}`}
        >
          {isActive && isPlaying ? <Equalizer active className="h-4" /> : <Icon name="play" size={18} className="ml-0.5" />}
        </button>
        {isActive && (
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur">
            {isPlaying ? 'Now playing' : 'Selected'}
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleLike?.(song)}
          className={`btn-icon absolute right-3 top-3 h-8 w-8 bg-black/55 text-white backdrop-blur transition-opacity hover:bg-rose-500/80 ${isLiked ? 'text-rose-400' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100'}`}
          aria-label={`${isLiked ? 'Unlike' : 'Like'} ${song.title}`}
          aria-pressed={isLiked}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" size={16} className={isLiked ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="mt-4 px-1 pb-1">
        <h3 className="truncate text-sm font-bold tracking-tight text-white sm:text-[15px]">{song.title}</h3>
        <p className="mt-1 truncate text-xs text-zinc-400">{song.artist}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-zinc-400">{song.genre}</span>
          <div className="flex flex-none items-center gap-1">
            <span className="mr-1 text-[11px] font-medium tabular-nums text-zinc-500">{formatTime(song.duration)}</span>
            <button
              type="button"
              className="btn-icon h-7 w-7 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
              onClick={() => onAddToPlaylist(song)}
              aria-label={`Add ${song.title} to a playlist`}
              title="Add to playlist"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
