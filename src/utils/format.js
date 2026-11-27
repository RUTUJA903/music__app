export function formatTime(seconds = 0) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0))
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function formatDuration(seconds = 0) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(safe / 3600)
  const mins = Math.floor((safe % 3600) / 60)
  if (hours > 0) return `${hours} hr ${mins} min`
  return `${mins} min`
}

export function totalDuration(songs = []) {
  return songs.reduce((sum, song) => sum + (Number(song?.duration) || 0), 0)
}

export function uniqueId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
