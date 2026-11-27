import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal.jsx'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'

export default function AddToPlaylistModal({ open, song, playlists = [], onClose, onAdd, onCreateAndAdd }) {
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setNewName('')
      setError('')
    }
  }, [open, song])

  if (!song) return null

  const handleCreate = (event) => {
    event.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) {
      setError('Enter a playlist name.')
      inputRef.current?.focus()
      return
    }
    if (playlists.some((p) => p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setError('A playlist with that name already exists.')
      return
    }
    onCreateAndAdd(trimmed, song)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add to playlist"
      subtitle="Choose where this track should live."
      maxWidth="max-w-lg"
    >
      <div className="surface-soft flex items-center gap-3 rounded-2xl p-3">
        <CoverArt item={song} className="h-12 w-12 flex-none" rounded="rounded-xl" glyph={false} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{song.title}</p>
          <p className="truncate text-xs text-zinc-500">{song.artist}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Your playlists</p>
        <span className="text-[11px] text-zinc-600">{playlists.length} available</span>
      </div>
      <div className="mt-2 max-h-64 space-y-1.5 overflow-y-auto pr-1 scroll-thin">
        {playlists.length ? playlists.map((playlist) => {
          const alreadyAdded = playlist.songIds.includes(song.id)
          return (
            <div key={playlist.id} className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${alreadyAdded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.055]'}`}>
              <CoverArt item={playlist} className="h-10 w-10 flex-none" rounded="rounded-lg" glyph={false} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{playlist.name}</p>
                <p className="text-[11px] text-zinc-500">{playlist.songIds.length} songs</p>
              </div>
              <button
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${alreadyAdded ? 'cursor-default bg-white/[0.05] text-zinc-500' : 'bg-purple-500/15 text-purple-200 hover:bg-purple-500 hover:text-white'}`}
                disabled={alreadyAdded}
                onClick={() => onAdd(playlist.id, song)}
              >
                {alreadyAdded ? 'Added' : 'Add'}
              </button>
            </div>
          )
        }) : (
          <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center text-xs text-zinc-500">No playlists yet — create one below.</p>
        )}
      </div>

      <form onSubmit={handleCreate} className="mt-5 border-t border-white/[0.07] pt-5">
        <label htmlFor="new-playlist-name" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Create a new playlist with this song</label>
        <div className="flex gap-2">
          <input
            id="new-playlist-name"
            ref={inputRef}
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value)
              if (error) setError('')
            }}
            placeholder="Playlist name"
            maxLength={50}
            className={`input-field ${error ? '!border-rose-500/60' : ''}`}
            aria-invalid={Boolean(error)}
          />
          <button type="submit" className="btn-primary flex-none px-4">
            <Icon name="plus" size={16} />
            Create
          </button>
        </div>
        {error ? <p className="mt-2 text-xs font-semibold text-rose-400">{error}</p> : null}
      </form>
    </Modal>
  )
}
