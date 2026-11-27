import React from 'react'
import SongCard from './SongCard.jsx'
import SongRow from './SongRow.jsx'
import LoadingSkeleton from './LoadingSkeleton.jsx'
import EmptyState from './EmptyState.jsx'

export default function SongCollection({
  songs = [],
  layout = 'grid',
  loading = false,
  currentSongId,
  isPlaying,
  onPlay,
  onAddToPlaylist,
  likedIds = [],
  onToggleLike,
  onClearFilters,
  emptyTitle = 'No songs found',
  emptyDescription = 'Try a different search or genre filter.',
}) {
  if (loading) return <LoadingSkeleton variant={layout === 'list' ? 'row' : 'card'} count={layout === 'list' ? 7 : 8} />

  if (!songs.length) {
    return (
      <EmptyState
        icon="search"
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Clear filters"
        onAction={onClearFilters}
        compact
      />
    )
  }

  if (layout === 'list') {
    return (
      <div className="surface overflow-hidden rounded-3xl p-2 sm:p-3">
        <div className="hidden items-center gap-3 px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600 md:flex sm:gap-4">
          <span className="w-5 flex-none">#</span>
          <span className="flex-1">Title</span>
          <span className="w-32 flex-none">Album</span>
          <span className="w-28 flex-none lg:block hidden">Genre</span>
          <span className="w-10 flex-none text-right">Time</span>
          <span className="w-24 flex-none" />
        </div>
        {songs.map((song, index) => (
          <SongRow
            key={song.id}
            song={song}
            index={index}
            isActive={song.id === currentSongId}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onAddToPlaylist={onAddToPlaylist}
            isLiked={likedIds.includes(song.id)}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isActive={song.id === currentSongId}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onAddToPlaylist={onAddToPlaylist}
          isLiked={likedIds.includes(song.id)}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  )
}
