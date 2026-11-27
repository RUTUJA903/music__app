import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import { formatDuration, totalDuration } from '../utils/format.js'

export default function PlaylistCard({ playlist, songs = [], isActive = false, onOpen, onPlay, onShuffle, onRename, onDelete }) {
  const duration = formatDuration(totalDuration(songs))

  return (
    <article className={`surface cover-tile group relative min-w-0 overflow-hidden rounded-[1.6rem] p-3 ${isActive ? 'ring-1 ring-purple-400/50' : ''}`}>
      <div className="relative">
        <button type="button" onClick={() => onOpen(playlist)} className="block w-full text-left" aria-label={`Open playlist ${playlist.name}`}>
          <CoverArt item={playlist} className="aspect-square w-full" rounded="rounded-2xl" />
        </button>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
        <button
          type="button"
          onClick={() => onPlay(playlist, songs)}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-white opacity-0 shadow-xl transition-all duration-200 hover:scale-110 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
          aria-label={`Play playlist ${playlist.name}`}
        >
          <Icon name="play" size={18} className="ml-0.5" />
        </button>
        <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
          <button type="button" className="btn-icon h-8 w-8 bg-black/55 text-white backdrop-blur hover:bg-purple-600/80" onClick={() => onShuffle?.(playlist, songs)} aria-label={`Shuffle ${playlist.name}`} title="Shuffle playlist">
            <Icon name="shuffle" size={15} />
          </button>
          <button type="button" className="btn-icon h-8 w-8 bg-black/55 text-white backdrop-blur hover:bg-purple-600/80" onClick={() => onRename(playlist)} aria-label={`Rename ${playlist.name}`}>
            <Icon name="edit" size={15} />
          </button>
          <button type="button" className="btn-icon h-8 w-8 bg-black/55 text-white backdrop-blur hover:bg-rose-600/80" onClick={() => onDelete(playlist)} aria-label={`Delete ${playlist.name}`}>
            <Icon name="trash" size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-start justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <button type="button" onClick={() => onOpen(playlist)} className="block max-w-full truncate text-left text-sm font-bold text-white transition-colors hover:text-purple-300 sm:text-[15px]">
            {playlist.name}
          </button>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {playlist.description || 'Your personal mix'} · {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </p>
          <p className="mt-1 text-[11px] font-medium text-zinc-600">{duration} total</p>
        </div>
        <button
          type="button"
          onClick={() => onOpen(playlist)}
          className="btn-icon mt-1 h-8 w-8 flex-none border border-white/10 text-zinc-400 group-hover:border-purple-400/40 group-hover:text-purple-300"
          aria-label={`Open ${playlist.name}`}
        >
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </article>
  )
}
