const PLAYLISTS_KEY = 'sonora.playlists.v1'
const RECENT_KEY = 'sonora.recentlyPlayed.v1'
const LIKED_KEY = 'sonora.likedSongs.v1'

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private browsing; the app still works in memory.
  }
}

export function loadPlaylists() {
  const stored = read(PLAYLISTS_KEY, null)
  if (Array.isArray(stored)) {
    return stored.filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
  }
  const seeds = [
    {
      id: 'playlist-neon',
      name: 'Neon Nights',
      description: 'Synth-soaked sounds for after dark.',
      songIds: ['s2', 's6', 's14', 's9', 's1'],
      createdAt: Date.now() - 5000,
    },
    {
      id: 'playlist-focus',
      name: 'Focus Flow',
      description: 'Soft textures for deep work.',
      songIds: ['s5', 's10', 's15', 's8'],
      createdAt: Date.now() - 4000,
    },
    {
      id: 'playlist-afterhours',
      name: 'After Hours',
      description: 'Slow burns and velvet vocals.',
      songIds: ['s13', 's3', 's8', 's1'],
      createdAt: Date.now() - 3000,
    },
  ]
  write(PLAYLISTS_KEY, seeds)
  return seeds
}

export function savePlaylists(playlists) {
  write(PLAYLISTS_KEY, playlists)
}

export function loadRecent() {
  const stored = read(RECENT_KEY, [])
  return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
}

export function saveRecent(ids) {
  write(RECENT_KEY, ids)
}

export function loadLiked() {
  const stored = read(LIKED_KEY, [])
  return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : []
}

export function saveLiked(ids) {
  write(LIKED_KEY, ids)
}
