import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal.jsx'
import Icon from './Icon.jsx'

export default function CreatePlaylistModal({ open, onClose, onSubmit, playlists = [], playlist = null }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const isRename = Boolean(playlist)

  useEffect(() => {
    if (!open) return
    setName(playlist?.name || '')
    setDescription(playlist?.description || '')
    setError('')
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => window.clearTimeout(timer)
  }, [open, playlist])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Give your playlist a name to continue.')
      return
    }
    if (playlists.some((p) => p.id !== playlist?.id && p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setError('A playlist with that name already exists.')
      return
    }
    onSubmit(trimmed, description.trim())
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isRename ? 'Rename playlist' : 'Create a playlist'}
      subtitle={isRename ? 'Give this mix a new name.' : 'Build a mix that feels like you. You can always change it later.'}
    >
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="playlist-name" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Playlist name</label>
        <input
          id="playlist-name"
          ref={inputRef}
          className={`input-field ${error ? '!border-rose-500/60' : ''}`}
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError('')
          }}
          placeholder="e.g. Late Night Drive"
          maxLength={50}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'playlist-name-error' : undefined}
        />
        {error ? (
          <p id="playlist-name-error" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <Icon name="close" size={13} /> {error}
          </p>
        ) : null}

        <label htmlFor="playlist-description" className="mb-2 mt-5 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Description <span className="normal-case tracking-normal text-zinc-600">(optional)</span></label>
        <textarea
          id="playlist-description"
          className="input-field resize-none"
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="A few words about this mix..."
          maxLength={120}
        />

        <div className="mt-7 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            <Icon name={isRename ? 'check' : 'plus'} size={16} />
            {isRename ? 'Save changes' : 'Create playlist'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
