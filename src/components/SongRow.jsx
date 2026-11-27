import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'
import { formatTime } from '../utils/format.js'

export default function SongRow({ song, index, isActive = false, isPlaying = false, onPlay, onAddToPlaylist, isLiked = false, onToggleLike, showAlbum = true, showGenre = true }) {
  return (
    <div
      className={`group flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-white/[0.055] sm:gap-4 sm:px-4 ${isActive ? 'bg-purple-500/[0.09] ring-1 ring-inset ring-purple-400/20' : ''}`}
    >
      <div className="w-5 flex-none text-center text-xs font-semibold tabular-nums text-zinc-600">
        {isActive && isPlaying ? <Equalizer active className="mx-auto h-3.5 group-hover:hidden" /> : <span className="group-hover:hidden">{String(index + 1).padStart(2, '0')}</span>}
        <button
          type="button"
          onClick={() => onPlay(song)}
          className="hidden text-purple-300 group-hover:inline-flex"
          aria-label={`Play ${song.title}`}
        >
          <Icon name="play" size={14} />
        </button>
      </div>

      <button type="button" onClick={() => onPlay(song)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Play ${song.title} by ${song.artist}`}>
        <CoverArt item={song} className="h-11 w-11 flex-none sm:h-12 sm:w-12" rounded="rounded-xl" glyph={false} />
        <span className="min-w-0">
          <span className={`block truncate text-sm font-bold ${isActive && isPlaying ? 'text-purple-300' : 'text-white'}`}>{song.title}</span>
          <span className="mt-0.5 block truncate text-xs text-zinc-500">{song.artist}</span>
        </span>
      </button>

      {showAlbum && <span className="hidden w-32 flex-none truncate text-xs font-medium text-zinc-500 md:block">{song.album}</span>}
      {showGenre && <span className="hidden w-28 flex-none truncate text-xs font-medium text-zinc-500 lg:block">{song.genre}</span>}

      <span className="w-10 flex-none text-right text-xs font-medium tabular-nums text-zinc-500">{formatTime(song.duration)}</span>

      <div className="flex w-24 flex-none items-center justify-end gap-0.5">
        <button
          type="button"
          className={`btn-icon h-8 w-8 ${isLiked ? 'text-rose-400' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100'}`}
          onClick={() => onToggleLike?.(song)}
          aria-label={`${isLiked ? 'Unlike' : 'Like'} ${song.title}`}
          aria-pressed={isLiked}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" size={16} className={isLiked ? 'fill-current' : ''} />
        </button>
        <button
          type="button"
          className="btn-icon h-8 w-8 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
          onClick={() => onAddToPlaylist(song)}
          aria-label={`Add ${song.title} to a playlist`}
          title="Add to playlist"
        >
          <Icon name="plus" size={16} />
        </button>
        <button
          type="button"
          className={`btn-icon h-8 w-8 ${isActive && isPlaying ? 'text-purple-300' : ''}`}
          onClick={() => onPlay(song)}
          aria-label={`Play ${song.title}`}
        >
          <Icon name="play" size={15} />
        </button>
      </div>
    </div>
  )
}
