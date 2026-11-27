import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'

import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import SectionHeading from './components/SectionHeading.jsx'
import SongCollection from './components/SongCollection.jsx'
import SongCard from './components/SongCard.jsx'
import SongRow from './components/SongRow.jsx'
import PlaylistCard from './components/PlaylistCard.jsx'
import PlaylistDetails from './components/PlaylistDetails.jsx'
import QueuePanel from './components/QueuePanel.jsx'
import GenreCard from './components/GenreCard.jsx'
import CoverArt, { paletteFor } from './components/CoverArt.jsx'
import EmptyState from './components/EmptyState.jsx'
import LoadingSkeleton from './components/LoadingSkeleton.jsx'
import CreatePlaylistModal from './components/CreatePlaylistModal.jsx'
import DeleteConfirmationModal from './components/DeleteConfirmationModal.jsx'
import AddToPlaylistModal from './components/AddToPlaylistModal.jsx'
import PlayerBar from './components/PlayerBar.jsx'
import Toast from './components/Toast.jsx'
import Icon from './components/Icon.jsx'

import { formatDuration, totalDuration, uniqueId } from './utils/format.js'
import { loadPlaylists, savePlaylists, loadRecent, saveRecent, loadLiked, saveLiked } from './utils/storage.js'

const sortOptions = [
  { value: 'featured', label: 'Featured order' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'artist', label: 'Artist A–Z' },
  { value: 'durationAsc', label: 'Shortest first' },
  { value: 'durationDesc', label: 'Longest first' },
]

function parsePlays(value = '') {
  const amount = parseFloat(value) || 0
  if (/M/i.test(value)) return amount * 1_000_000
  if (/K/i.test(value)) return amount * 1_000
  return amount
}

export default function App() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [playlists, setPlaylists] = useState(loadPlaylists)
  const [recentIds, setRecentIds] = useState(loadRecent)
  const [likedIds, setLikedIds] = useState(loadLiked)
  const [activeView, setActiveView] = useState('home')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(() => loadPlaylists()[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [layout, setLayout] = useState('grid')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sonora.sidebar.collapsed.v1') === 'true'
    } catch {
      return false
    }
  })

  const [playlistModal, setPlaylistModal] = useState({ open: false, playlist: null })
  const [playlistToDelete, setPlaylistToDelete] = useState(null)
  const [songToAdd, setSongToAdd] = useState(null)
  const [toast, setToast] = useState(null)

  const [currentSongId, setCurrentSongId] = useState(null)
  const [queue, setQueue] = useState([])
  const [contextName, setContextName] = useState('Your library')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(70)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const mainRef = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now() + Math.random(), message, type })
  }, [])

  const toggleLike = useCallback((song) => {
    if (!song) return
    const wasLiked = likedIds.includes(song.id)
    setLikedIds((previous) => (wasLiked ? previous.filter((id) => id !== song.id) : [song.id, ...previous]))
    showToast(wasLiked ? `Removed "${song.title}" from Liked Songs.` : `Added "${song.title}" to Liked Songs.`)
  }, [likedIds, showToast])

  const fetchSongs = useCallback(() => {
    setLoading(true)
    setError('')
    axios
      .get(`${import.meta.env.BASE_URL}songs.json`, { timeout: 10000 })
      .then((response) => {
        const list = Array.isArray(response.data?.songs) ? response.data.songs : Array.isArray(response.data) ? response.data : []
        setSongs(list)
      })
      .catch(() => setError('We could not load the music library. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  useEffect(() => savePlaylists(playlists), [playlists])
  useEffect(() => saveRecent(recentIds), [recentIds])
  useEffect(() => saveLiked(likedIds), [likedIds])
  useEffect(() => {
    try {
      localStorage.setItem('sonora.sidebar.collapsed.v1', String(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName
      if (event.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault()
        document.querySelector('input[type="search"]')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const songById = useMemo(() => new Map(songs.map((song) => [song.id, song])), [songs])
  const currentSong = songById.get(currentSongId) || null
  const libraryIds = useMemo(() => songs.map((song) => song.id), [songs])

  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return []
    return songs.filter((song) => `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(term))
  }, [songs, searchQuery])

  const filteredSongs = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    let result = songs.filter((song) => {
      const matchesTerm = !term || `${song.title} ${song.artist} ${song.album} ${song.genre}`.toLowerCase().includes(term)
      const matchesGenre = genreFilter === 'All' || song.genre === genreFilter
      return matchesTerm && matchesGenre
    })
    result = [...result]
    if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'artist') result.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title))
    if (sortBy === 'durationAsc') result.sort((a, b) => a.duration - b.duration)
    if (sortBy === 'durationDesc') result.sort((a, b) => b.duration - a.duration)
    return result
  }, [songs, searchQuery, genreFilter, sortBy])

  const genres = useMemo(() => {
    const counts = new Map()
    songs.forEach((song) => counts.set(song.genre, (counts.get(song.genre) || 0) + 1))
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [songs])

  const trendingSongs = useMemo(() => [...songs].sort((a, b) => parsePlays(b.plays) - parsePlays(a.plays)).slice(0, 5), [songs])
  const newestSongs = useMemo(() => [...songs].reverse().slice(0, 4), [songs])
  const recentSongs = useMemo(() => recentIds.map((id) => songById.get(id)).filter(Boolean), [recentIds, songById])
  const likedSongs = useMemo(() => likedIds.map((id) => songById.get(id)).filter(Boolean), [likedIds, songById])

  const selectedPlaylist = playlists.find((playlist) => playlist.id === selectedPlaylistId) || null
  const selectedPlaylistSongs = useMemo(
    () => (selectedPlaylist?.songIds || []).map((id) => songById.get(id)).filter(Boolean),
    [selectedPlaylist, songById],
  )
  const playlistToDeleteSongs = useMemo(
    () => (playlistToDelete?.songIds || []).map((id) => songById.get(id)).filter(Boolean),
    [playlistToDelete, songById],
  )

  const currentQueueIndex = queue.findIndex((id) => id === currentSongId)
  const upNext = useMemo(() => {
    if (!currentSong || !queue.length) return []
    const start = currentQueueIndex < 0 ? 0 : currentQueueIndex
    const ordered = repeatMode === 'all' || repeatMode === 'one'
      ? [...queue.slice(start + 1), ...queue.slice(0, Math.max(start, 0))]
      : queue.slice(start + 1)
    return ordered.map((id) => songById.get(id)).filter(Boolean)
  }, [currentSong, currentQueueIndex, queue, repeatMode, songById])

  const playSong = useCallback((song, customQueue, customContext) => {
    if (!song) return
    const nextQueue = customQueue?.length ? customQueue : libraryIds
    setQueue(nextQueue)
    setCurrentSongId(song.id)
    setContextName(customContext || 'Your library')
    setProgress(0)
    setIsPlaying(true)
    setRecentIds((previous) => [song.id, ...previous.filter((id) => id !== song.id)].slice(0, 24))
  }, [libraryIds])

  const playPlaylist = useCallback((playlist, list) => {
    if (!list?.length) {
      showToast('Add a few songs to this playlist first.', 'error')
      return
    }
    setShuffle(false)
    setRepeatMode('off')
    playSong(list[0], list.map((song) => song.id), playlist.name)
  }, [playSong, showToast])

  const shufflePlaylist = useCallback((playlist, list) => {
    if (!list?.length) {
      showToast('Add a few songs to this playlist first.', 'error')
      return
    }
    const ids = list.map((song) => song.id)
    const shuffled = [...ids].sort(() => Math.random() - 0.5)
    setShuffle(true)
    setRepeatMode('off')
    playSong(songById.get(shuffled[0]) || list[0], shuffled, playlist.name)
    showToast(`Shuffling ${playlist.name}.`)
  }, [playSong, showToast, songById])

  const cycleRepeat = useCallback(() => {
    setRepeatMode((mode) => (mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'))
  }, [])

  const nextSong = useCallback(() => {
    if (!queue.length) return
    if (!shuffle && repeatMode === 'off' && currentQueueIndex >= queue.length - 1) return
    let nextId
    if (shuffle && queue.length > 1) {
      const options = queue.filter((id) => id !== currentSongId)
      nextId = options[Math.floor(Math.random() * options.length)]
    } else {
      const index = queue.indexOf(currentSongId)
      nextId = queue[(index + 1 + queue.length) % queue.length]
    }
    setCurrentSongId(nextId)
    setProgress(0)
    setIsPlaying(true)
    setRecentIds((previous) => [nextId, ...previous.filter((id) => id !== nextId)].slice(0, 24))
  }, [queue, currentSongId, currentQueueIndex, shuffle, repeatMode])

  const previousSong = useCallback(() => {
    if (!queue.length) return
    if (progress > 3) {
      setProgress(0)
      return
    }
    const index = queue.indexOf(currentSongId)
    const previousId = queue[(index - 1 + queue.length) % queue.length]
    setCurrentSongId(previousId)
    setProgress(0)
    setIsPlaying(true)
  }, [queue, currentSongId, progress])

  useEffect(() => {
    if (!isPlaying || !currentSong) return undefined
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 1, currentSong.duration))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isPlaying, currentSong?.id, currentSong?.duration])

  useEffect(() => {
    if (currentSong && progress >= currentSong.duration) {
      if (repeatMode === 'one') {
        setProgress(0)
      } else if (shuffle || repeatMode === 'all' || currentQueueIndex < queue.length - 1) {
        nextSong()
      } else {
        setIsPlaying(false)
      }
    }
  }, [progress, currentSong, repeatMode, shuffle, currentQueueIndex, queue.length, nextSong])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setGenreFilter('All')
    setSortBy('featured')
  }, [])

  const navigate = useCallback((view) => {
    setActiveView(view)
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const openPlaylist = useCallback((playlist) => {
    setSelectedPlaylistId(playlist.id)
    navigate('playlists')
  }, [navigate])

  const browseSongsForPlaylist = useCallback(() => {
    navigate('library')
    showToast('Pick a song, then tap + to add it to this playlist.')
  }, [navigate, showToast])

  const handleCreatePlaylist = useCallback((name, description) => {
    const playlist = { id: uniqueId('playlist'), name, description, songIds: [], createdAt: Date.now() }
    setPlaylists((previous) => [playlist, ...previous])
    setSelectedPlaylistId(playlist.id)
    setPlaylistModal({ open: false, playlist: null })
    navigate('playlists')
    showToast(`"${name}" is ready for your music.`)
  }, [navigate, showToast])

  const handleRenamePlaylist = useCallback((name, description) => {
    const target = playlistModal.playlist
    if (!target) return
    setPlaylists((previous) => previous.map((playlist) => (playlist.id === target.id ? { ...playlist, name, description } : playlist)))
    setPlaylistModal({ open: false, playlist: null })
    showToast(`Playlist renamed to "${name}".`)
  }, [playlistModal, showToast])

  const handleDeletePlaylist = useCallback((playlist) => {
    setPlaylists((previous) => previous.filter((item) => item.id !== playlist.id))
    setSelectedPlaylistId((previous) => (previous === playlist.id ? playlists.find((item) => item.id !== playlist.id)?.id || null : previous))
    setPlaylistToDelete(null)
    showToast(`"${playlist.name}" was deleted.`)
  }, [playlists, showToast])

  const handleAddToPlaylist = useCallback((playlistId, song) => {
    const playlist = playlists.find((item) => item.id === playlistId)
    if (!playlist) return
    if (playlist.songIds.includes(song.id)) {
      showToast(`Already in "${playlist.name}".`, 'error')
      return
    }
    setPlaylists((previous) => previous.map((item) => (item.id === playlistId ? { ...item, songIds: [...item.songIds, song.id] } : item)))
    showToast(`Added to "${playlist.name}".`)
  }, [playlists, showToast])

  const handleCreateAndAdd = useCallback((name, song) => {
    const playlist = { id: uniqueId('playlist'), name, description: '', songIds: [song.id], createdAt: Date.now() }
    setPlaylists((previous) => [playlist, ...previous])
    setSelectedPlaylistId(playlist.id)
    setSongToAdd(null)
    showToast(`"${name}" created with ${song.title}.`)
  }, [showToast])

  const handleCreateLikedPlaylist = useCallback(() => {
    const ids = likedSongs.map((song) => song.id)
    if (!ids.length) {
      showToast('Like a few songs first, then save them as a playlist.', 'error')
      return
    }
    const playlist = {
      id: uniqueId('playlist'),
      name: 'Liked Songs',
      description: 'Every track you hearted, in one mix.',
      songIds: ids,
      createdAt: Date.now(),
    }
    setPlaylists((previous) => [playlist, ...previous])
    setSelectedPlaylistId(playlist.id)
    setPlaylistModal({ open: false, playlist: null })
    navigate('playlists')
    showToast(`Created "${playlist.name}" with ${ids.length} songs.`)
  }, [likedSongs, navigate, showToast])

  const handleShuffleLiked = useCallback(() => {
    if (!likedSongs.length) {
      showToast('Like a few songs first to shuffle them.', 'error')
      return
    }
    const ids = likedSongs.map((song) => song.id)
    const shuffled = [...ids].sort(() => Math.random() - 0.5)
    setShuffle(true)
    setRepeatMode('off')
    playSong(songById.get(shuffled[0]), shuffled, 'Liked Songs')
    showToast('Shuffle is on — playing your liked songs in random order.')
  }, [likedSongs, playSong, showToast, songById])

  const handleRemoveFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((previous) => previous.map((playlist) => (
      playlist.id === playlistId ? { ...playlist, songIds: playlist.songIds.filter((id) => id !== songId) } : playlist
    )))
    showToast('Song removed from playlist.')
  }, [showToast])

  const handleMoveSong = useCallback((playlistId, index, direction) => {
    setPlaylists((previous) => previous.map((playlist) => {
      if (playlist.id !== playlistId) return playlist
      const target = index + direction
      if (target < 0 || target >= playlist.songIds.length) return playlist
      const reordered = [...playlist.songIds]
      ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
      return { ...playlist, songIds: reordered }
    }))
  }, [])

  const handleReorderSongs = useCallback((playlistId, from, to) => {
    setPlaylists((previous) => previous.map((playlist) => {
      if (playlist.id !== playlistId) return playlist
      const reordered = [...playlist.songIds]
      const [moved] = reordered.splice(from, 1)
      reordered.splice(to, 0, moved)
      return { ...playlist, songIds: reordered }
    }))
  }, [])

  const handleSearchSubmit = useCallback(() => navigate('discover'), [navigate])
  const handleGenreSelect = useCallback((genre) => {
    setGenreFilter(genre)
    navigate('discover')
  }, [navigate])

  const toolbar = (
    <div className="surface-soft mb-5 flex flex-col gap-3 rounded-2xl p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          <Icon name="filter" size={14} /> Genre
        </span>
        {['All', ...genres.map(([name]) => name)].map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => setGenreFilter(genre)}
            className={`chip ${genreFilter === genre ? 'chip-active' : ''}`}
            aria-pressed={genreFilter === genre}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <p className="text-xs text-zinc-500">
          Showing <span className="font-bold text-white">{filteredSongs.length}</span> {filteredSongs.length === 1 ? 'track' : 'tracks'}
          {searchQuery.trim() ? <> for <span className="font-semibold text-purple-300">"{searchQuery.trim()}"</span></> : null}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="song-sort" className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">Sort</label>
          <select id="song-sort" className="input-field !w-auto !py-1.5 !text-xs" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/20 p-0.5" role="group" aria-label="Layout">
            <button type="button" className={`btn-icon h-7 w-7 ${layout === 'grid' ? 'active' : ''}`} onClick={() => setLayout('grid')} aria-label="Grid layout" aria-pressed={layout === 'grid'}>
              <Icon name="grid" size={14} />
            </button>
            <button type="button" className={`btn-icon h-7 w-7 ${layout === 'list' ? 'active' : ''}`} onClick={() => setLayout('list')} aria-label="List layout" aria-pressed={layout === 'list'}>
              <Icon name="rows" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const featuredPlaylist = playlists.find((playlist) => playlist.songIds.length) || playlists[0] || null
  const featuredSongs = (featuredPlaylist?.songIds || []).map((id) => songById.get(id)).filter(Boolean)
  const [featuredColorFrom, featuredColorTo] = paletteFor(featuredPlaylist || songs[0] || {})

  const renderHome = () => {
    if (error) {
      return <EmptyState icon="wave" title="Library unavailable" description={error} actionLabel="Try again" onAction={fetchSongs} />
    }

    const featuredItem = featuredPlaylist
      ? { label: 'Featured playlist', title: featuredPlaylist.name, description: featuredPlaylist.description || 'A hand-picked mix for every mood.', colorFrom: featuredColorFrom, colorTo: featuredColorTo }
      : songs[0]
        ? { label: 'Featured track', title: songs[0].title, description: `${songs[0].artist} · ${songs[0].album}`, colorFrom: paletteFor(songs[0])[0], colorTo: paletteFor(songs[0])[1] }
        : null

    return (
      <>
        {loading ? (
          <LoadingSkeleton variant="hero" />
        ) : featuredItem ? (
          <section className="surface relative overflow-hidden rounded-[2rem] p-6 sm:p-9" aria-label="Featured">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{ background: `radial-gradient(600px 300px at 85% 20%, ${featuredItem.colorFrom}45, transparent 70%), linear-gradient(120deg, rgba(23,23,34,0.9), ${featuredItem.colorTo}20)` }}
              aria-hidden="true"
            />
            <div className="relative grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-purple-200">
                  <Icon name="sparkles" size={15} /> {featuredItem.label}
                </p>
                <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">{featuredItem.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">{featuredItem.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="btn-primary px-5 py-3"
                    onClick={() => (featuredPlaylist ? playPlaylist(featuredPlaylist, featuredSongs) : playSong(songs[0]))}
                    disabled={featuredPlaylist ? !featuredSongs.length : !songs.length}
                  >
                    <Icon name="play" size={16} /> Play now
                  </button>
                  <button type="button" className="btn-secondary px-5 py-3" onClick={() => navigate('discover')}>
                    Explore music <Icon name="arrowRight" size={15} />
                  </button>
                </div>
                {featuredPlaylist && (
                  <p className="mt-5 text-[11px] font-semibold text-zinc-400">
                    {featuredSongs.length} tracks · {formatDuration(totalDuration(featuredSongs))}
                  </p>
                )}
              </div>
              <div className="relative hidden h-48 w-48 sm:block lg:h-56 lg:w-56">
                <div className="absolute inset-0 rotate-6 rounded-[2rem] border border-white/10 bg-white/[0.04]" aria-hidden="true" />
                <div className="absolute -inset-2 -rotate-6 rounded-[2rem] border border-purple-400/20" aria-hidden="true" />
                <CoverArt item={featuredPlaylist || songs[0]} className="relative h-full w-full rotate-3 rounded-[2rem] shadow-2xl" rounded="rounded-[2rem]" />
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeading eyebrow="Popular right now" title="Trending songs" description="The tracks everyone is listening to this week." actionLabel="See all" onAction={() => navigate('discover')} />
          {loading ? <LoadingSkeleton count={5} /> : (
            <div className="surface overflow-hidden rounded-3xl p-2 sm:p-3">
              {trendingSongs.map((song, index) => (
                <SongRow key={song.id} song={song} index={index} isActive={song.id === currentSongId} isPlaying={isPlaying} onPlay={playSong} onAddToPlaylist={setSongToAdd} isLiked={likedIds.includes(song.id)} onToggleLike={toggleLike} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading eyebrow="Fresh in the library" title="Recently added" actionLabel="View library" onAction={() => navigate('library')} />
          {loading ? (
            <LoadingSkeleton variant="card" count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {newestSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isActive={song.id === currentSongId}
                  isPlaying={isPlaying}
                  onPlay={playSong}
                  onAddToPlaylist={setSongToAdd}
                  isLiked={likedIds.includes(song.id)}
                  onToggleLike={toggleLike}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading eyebrow="Find your mood" title="Browse by genre" description="Every sound, one click away." />
          {loading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {genres.slice(0, 10).map(([genre, count]) => (
                <GenreCard key={genre} genre={genre} count={count} onClick={() => handleGenreSelect(genre)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading eyebrow="Made by you" title="Your playlists" description="Your mixes, always one tap away." actionLabel="View all" onAction={() => navigate('playlists')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.slice(0, 4).map((playlist) => {
              const list = playlist.songIds.map((id) => songById.get(id)).filter(Boolean)
              return (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  songs={list}
                  isActive={playlist.id === selectedPlaylistId}
                  onOpen={openPlaylist}
                  onPlay={playPlaylist}
                  onShuffle={shufflePlaylist}
                  onRename={(item) => setPlaylistModal({ open: true, playlist: item })}
                  onDelete={setPlaylistToDelete}
                />
              )
            })}
            <button
              type="button"
              onClick={() => setPlaylistModal({ open: true, playlist: null })}
              className="surface group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-dashed border-white/15 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-500/[0.06]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300 transition-transform group-hover:scale-110">
                <Icon name="folderPlus" size={22} />
              </span>
              <span className="text-sm font-bold text-white">Create playlist</span>
              <span className="text-xs text-zinc-500">Start a new mix</span>
            </button>
          </div>
        </section>
      </>
    )
  }

  const renderDiscover = () => (
    <section>
      <SectionHeading eyebrow="Explore the catalog" title="Discover" description="Search, filter and find your next favorite track." />
      {toolbar}
      <SongCollection
        songs={filteredSongs}
        layout={layout}
        loading={loading}
        currentSongId={currentSongId}
        isPlaying={isPlaying}
        onPlay={playSong}
        onAddToPlaylist={setSongToAdd}
        likedIds={likedIds}
        onToggleLike={toggleLike}
        onClearFilters={clearFilters}
        emptyTitle={searchQuery ? 'No matches found' : 'No songs in this genre'}
        emptyDescription="Try another search term or reset the filters to see the full library."
      />
    </section>
  )

  const renderLibrary = () => (
    <section>
      <SectionHeading eyebrow="Every track, organized" title="Your Library" description="All songs available in SONORA, ready for your playlists." />
      {toolbar}
      <SongCollection
        songs={filteredSongs}
        layout={layout}
        loading={loading}
        currentSongId={currentSongId}
        isPlaying={isPlaying}
        onPlay={playSong}
        onAddToPlaylist={setSongToAdd}
        likedIds={likedIds}
        onToggleLike={toggleLike}
        onClearFilters={clearFilters}
        emptyTitle="Your library is quiet"
        emptyDescription="Adjust your filters or reload the app to load the song catalog."
      />
    </section>
  )

  const renderPlaylists = () => (
    <section>
      <SectionHeading
        eyebrow="Your collection"
        title="Your Playlists"
        description="Create, rename and shape your mixes."
        actionLabel="New playlist"
        onAction={() => setPlaylistModal({ open: true, playlist: null })}
      />
      {playlists.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {playlists.map((playlist) => {
            const list = playlist.songIds.map((id) => songById.get(id)).filter(Boolean)
            return (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                songs={list}
                isActive={playlist.id === selectedPlaylistId}
                onOpen={openPlaylist}
                onPlay={playPlaylist}
                onShuffle={shufflePlaylist}
                onRename={(item) => setPlaylistModal({ open: true, playlist: item })}
                onDelete={setPlaylistToDelete}
              />
            )
          })}
          <button
            type="button"
            onClick={() => setPlaylistModal({ open: true, playlist: null })}
            className="surface group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-dashed border-white/15 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-500/[0.06]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300 transition-transform group-hover:scale-110">
              <Icon name="plus" size={22} />
            </span>
            <span className="text-sm font-bold text-white">New playlist</span>
            <span className="text-xs text-zinc-500">Give your ideas a home</span>
          </button>
        </div>
      ) : (
        <EmptyState icon="list" title="No playlists yet" description="Create your first playlist and start collecting the songs you love." actionLabel="Create playlist" onAction={() => setPlaylistModal({ open: true, playlist: null })} />
      )}
    </section>
  )

  const renderRecent = () => (
    <section>
      <SectionHeading eyebrow="Back to the good stuff" title="Recently Played" description="Pick up where you left off." />
      {recentSongs.length ? (
        <div className="surface rounded-3xl p-2 sm:p-3">
          {recentSongs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} isActive={song.id === currentSongId} isPlaying={isPlaying} onPlay={playSong} onAddToPlaylist={setSongToAdd} isLiked={likedIds.includes(song.id)} onToggleLike={toggleLike} />
          ))}
        </div>
      ) : (
        <EmptyState icon="clock" title="Nothing here yet" description="Songs you play will show up here so you can jump back in." actionLabel="Browse music" onAction={() => navigate('discover')} />
      )}
    </section>
  )

  const renderLiked = () => (
    <section>
      <SectionHeading
        eyebrow="Your favorites"
        title="Liked Songs"
        description={likedSongs.length ? `${likedSongs.length} ${likedSongs.length === 1 ? 'track' : 'tracks'} you love, all in one place.` : 'Songs you heart will collect here.'}
      />
      {likedSongs.length ? (
        <>
          <div className="surface-soft mb-5 flex flex-wrap items-center gap-2 rounded-2xl p-3 sm:p-4">
            <button type="button" className="btn-primary px-4 py-2.5" onClick={() => { setShuffle(false); setRepeatMode('off'); playSong(likedSongs[0], likedSongs.map((song) => song.id), 'Liked Songs') }}>
              <Icon name="play" size={15} /> Play all
            </button>
            <button type="button" className="btn-secondary px-4 py-2.5" onClick={handleShuffleLiked}>
              <Icon name="shuffle" size={15} /> Shuffle
            </button>
            <button type="button" className="btn-secondary px-4 py-2.5" onClick={handleCreateLikedPlaylist}>
              <Icon name="folderPlus" size={15} /> Save as playlist
            </button>
            <p className="ml-auto text-[11px] font-semibold text-zinc-500">Tap the heart on any song to add it here.</p>
          </div>
          <SongCollection
            songs={likedSongs}
            layout={layout}
            loading={loading}
            currentSongId={currentSongId}
            isPlaying={isPlaying}
            onPlay={playSong}
            onAddToPlaylist={setSongToAdd}
            likedIds={likedIds}
            onToggleLike={toggleLike}
            onClearFilters={() => navigate('discover')}
            emptyTitle="No liked songs yet"
            emptyDescription="Heart a song to see it here."
          />
        </>
      ) : (
        <EmptyState
          icon="heart"
          title="No liked songs yet"
          description="Tap the heart on any song and it will show up here, ready to play or save as a playlist."
          actionLabel="Explore music"
          onAction={() => navigate('discover')}
        />
      )}
    </section>
  )

  const viewRenderers = { home: renderHome, liked: renderLiked, discover: renderDiscover, library: renderLibrary, playlists: renderPlaylists, recent: renderRecent }

  return (
    <div className="flex h-screen flex-col overflow-hidden text-white">
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeView={activeView}
          onNavigate={navigate}
          onCreatePlaylist={() => setPlaylistModal({ open: true, playlist: null })}
          playlists={playlists}
          likedCount={likedIds.length}
          selectedPlaylistId={selectedPlaylistId}
          onOpenPlaylist={openPlaylist}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          currentSong={currentSong}
          isPlaying={isPlaying}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            onMenu={() => setMobileNavOpen(true)}
            search={{ value: searchQuery, onChange: setSearchQuery }}
            results={searchResults}
            onPlaySong={playSong}
            onSearchSubmit={handleSearchSubmit}
          />

          <div className="flex min-h-0 flex-1">
            <main ref={mainRef} className="scroll-thin min-w-0 flex-1 overflow-y-auto px-4 pb-10 pt-7 sm:px-6 lg:px-8 xl:px-10" aria-label="Main content">
              <div key={activeView} className="mx-auto max-w-[1500px] space-y-9 animate-fade-up">
                {viewRenderers[activeView]?.()}
              </div>
            </main>

            <aside className="scroll-thin hidden w-[320px] flex-none space-y-4 overflow-y-auto border-l border-white/[0.06] px-5 py-7 xl:block 2xl:w-[340px]" aria-label="Playlist details and queue">
              {selectedPlaylist && (
                <PlaylistDetails
                  playlist={selectedPlaylist}
                  songs={selectedPlaylistSongs}
                  currentSongId={currentSongId}
                  isPlaying={isPlaying}
                  onPlaySong={playSong}
                  onPlayAll={playPlaylist}
                  onShuffle={shufflePlaylist}
                  onRemove={handleRemoveFromPlaylist}
                  onMove={handleMoveSong}
                  onReorder={handleReorderSongs}
                  onRename={(item) => setPlaylistModal({ open: true, playlist: item })}
                  onDelete={setPlaylistToDelete}
                  onBrowseSongs={browseSongsForPlaylist}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                />
              )}
              <QueuePanel currentSong={currentSong} upNext={upNext} contextName={contextName} isPlaying={isPlaying} repeatMode={repeatMode} onPlaySong={playSong} likedIds={likedIds} onToggleLike={toggleLike} />
            </aside>
          </div>
        </div>
      </div>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        shuffle={shuffle}
        repeatMode={repeatMode}
        onTogglePlay={() => setIsPlaying((value) => !value)}
        onNext={nextSong}
        onPrevious={previousSong}
        onSeek={(value) => setProgress(value)}
        onVolumeChange={setVolume}
        onToggleShuffle={() => setShuffle((value) => !value)}
        onCycleRepeat={cycleRepeat}
        isLiked={currentSong ? likedIds.includes(currentSong.id) : false}
        onToggleLike={toggleLike}
      />

      <CreatePlaylistModal
        open={playlistModal.open}
        playlist={playlistModal.playlist}
        playlists={playlists}
        onClose={() => setPlaylistModal({ open: false, playlist: null })}
        onSubmit={playlistModal.playlist ? handleRenamePlaylist : handleCreatePlaylist}
      />
      <DeleteConfirmationModal
        open={Boolean(playlistToDelete)}
        playlist={playlistToDelete}
        songs={playlistToDeleteSongs}
        onClose={() => setPlaylistToDelete(null)}
        onConfirm={handleDeletePlaylist}
      />
      <AddToPlaylistModal
        open={Boolean(songToAdd)}
        song={songToAdd}
        playlists={playlists}
        onClose={() => setSongToAdd(null)}
        onAdd={handleAddToPlaylist}
        onCreateAndAdd={handleCreateAndAdd}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
