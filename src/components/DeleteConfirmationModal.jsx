import React from 'react'
import Modal from './Modal.jsx'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import { formatDuration, totalDuration } from '../utils/format.js'

export default function DeleteConfirmationModal({ open, playlist, songs = [], onClose, onConfirm }) {
  if (!playlist) return null
  return (
    <Modal open={open} onClose={onClose} title="Delete playlist?" subtitle="This action cannot be undone. Your songs will stay in the library.">
      <div className="surface-soft flex items-center gap-3 rounded-2xl p-3">
        <CoverArt item={playlist} className="h-14 w-14 flex-none" rounded="rounded-xl" glyph={false} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{playlist.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{songs.length} songs · {formatDuration(totalDuration(songs))}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-zinc-400">
        Are you sure you want to remove <span className="font-bold text-white">{playlist.name}</span> from your library?
      </p>
      <div className="mt-7 flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onClose}>Keep playlist</button>
        <button type="button" className="btn-danger" onClick={() => onConfirm(playlist)}>
          <Icon name="trash" size={16} />
          Delete playlist
        </button>
      </div>
    </Modal>
  )
}
