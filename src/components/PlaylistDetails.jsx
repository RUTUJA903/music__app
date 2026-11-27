import React, { useState } from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'
import { formatDuration, formatTime, totalDuration } from '../utils/format.js'

export default function PlaylistDetails({
  playlist,
  songs = [],
  currentSongId,
  isPlaying,
  onPlaySong,
  onPlayAll,
  onShuffle,
  onRemove,
  onMove,
  onReorder,
  onRename,
  onDelete,
  onBrowseSongs,
  likedIds = [],
  onToggleLike,
}) {
  const [dragIndex, setDragIndex] = useState(null)

  if (!playlist) return null

  return (
    <section className="surface animate-fade-up overflow-hidden rounded-[1.75rem]" aria-label={`${playlist.name} details`}>
      <div className="relative">
        <CoverArt item={playlist} className="h-40 w-full" rounded="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171722] via-[#171722]/30 to-transparent" aria-hidden="true" />
        <div className="absolute left-4 right-4 top-4 flex justify-end gap-1.5">
          <button type="button" className="btn-icon h-8 w-8 bg-black/40 text-white backdrop-blur hover:bg-purple-600/80" onClick={() => onRename(playlist)} aria-label={`Rename ${playlist.name}`}>
            <Icon name="edit" size={14} />
          </button>
          <button type="button" className="btn-icon h-8 w-8 bg-black/40 text-white backdrop-blur hover:bg-rose-600/80" onClick={() => onDelete(playlist)} aria-label={`Delete ${playlist.name}`}>
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>

      <div className="-mt-6 relative px-4 pb-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">Selected playlist</p>
        <h2 className="mt-1 truncate text-xl font-extrabold tracking-tight text-white">{playlist.name}</h2>
        {playlist.description ? <p className="mt-1 truncate text-xs text-zinc-500">{playlist.description}</p> : null}
        <p className="mt-2 text-[11px] font-medium text-zinc-500">
          {songs.length} {songs.length === 1 ? 'song' : 'songs'} · {formatDuration(totalDuration(songs))}
        </p>

        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-primary flex-1 py-2.5 text-xs" onClick={() => onPlayAll(playlist, songs)} disabled={!songs.length}>
            <Icon name="play" size={15} />
            Play all
          </button>
          <button type="button" className="btn-secondary flex-1 py-2.5 text-xs" onClick={onBrowseSongs}>
            <Icon name="plus" size={15} />
            Add songs
          </button>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-2 pb-3 pt-3 sm:px-3">
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Tracks</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShuffle?.(playlist, songs)}
              disabled={!songs.length}
              className="flex items-center gap-1 rounded-full border border-purple-400/25 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-200 transition-colors hover:bg-purple-500/20"
              title="Play the songs of this playlist in random order"
            >
              <Icon name="shuffle" size={12} /> Shuffle
            </button>
            <p className="hidden text-[10px] text-zinc-600 sm:block">Drag to reorder</p>
          </div>
        </div>

        {songs.length ? (
          <div className="scroll-thin max-h-72 space-y-0.5 overflow-y-auto pr-1">
            {songs.map((song, index) => {
              const active = song.id === currentSongId
              return (
                <div
                  key={song.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    if (dragIndex !== null && dragIndex !== index) onReorder(playlist.id, dragIndex, index)
                    setDragIndex(null)
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`group flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 transition-all ${active ? 'bg-purple-500/10' : 'hover:bg-white/[0.05]'} ${dragIndex === index ? 'opacity-40' : ''}`}
                >
                  <span className="w-4 flex-none cursor-grab text-zinc-600 active:cursor-grabbing" title="Drag to reorder" aria-hidden="true">
                    <Icon name="grip" size={13} />
                  </span>
                  <button type="button" onClick={() => onPlaySong(song, songs.map((s) => s.id), playlist.name)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                    <CoverArt item={song} className="h-9 w-9 flex-none" rounded="rounded-lg" glyph={false} />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-xs font-bold ${active && isPlaying ? 'text-purple-300' : 'text-white'}`}>{song.title}</span>
                      <span className="block truncate text-[10px] text-zinc-500">{song.artist} · {formatTime(song.duration)}</span>
                    </span>
                    {active && isPlaying ? <Equalizer active className="h-3 flex-none" /> : null}
                  </button>
                  <div className="flex flex-none items-center opacity-60 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className={`btn-icon h-6 w-6 ${likedIds.includes(song.id) ? 'text-rose-400' : ''}`}
                      onClick={() => onToggleLike?.(song)}
                      aria-label={`${likedIds.includes(song.id) ? 'Unlike' : 'Like'} ${song.title}`}
                      aria-pressed={likedIds.includes(song.id)}
                      title={likedIds.includes(song.id) ? 'Unlike' : 'Like'}
                    >
                      <Icon name="heart" size={14} className={likedIds.includes(song.id) ? 'fill-current' : ''} />
                    </button>
                    <button type="button" className="btn-icon h-6 w-6" onClick={() => onMove(playlist.id, index, -1)} disabled={index === 0} aria-label={`Move ${song.title} up`} title="Move up">
                      <Icon name="chevronUp" size={14} />
                    </button>
                    <button type="button" className="btn-icon h-6 w-6" onClick={() => onMove(playlist.id, index, 1)} disabled={index === songs.length - 1} aria-label={`Move ${song.title} down`} title="Move down">
                      <Icon name="chevronDown" size={14} />
                    </button>
                    <button type="button" className="btn-icon h-6 w-6 hover:!text-rose-400" onClick={() => onRemove(playlist.id, song.id)} aria-label={`Remove ${song.title} from ${playlist.name}`} title="Remove from playlist">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-2 py-6 text-center">
            <p className="text-xs font-semibold text-zinc-400">This playlist is empty</p>
            <button type="button" className="mt-2 text-xs font-bold text-purple-300 hover:text-purple-200" onClick={onBrowseSongs}>Browse songs to add</button>
          </div>
        )}
      </div>
    </section>
  )
}
