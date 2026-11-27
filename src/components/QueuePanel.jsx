import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'

export default function QueuePanel({ currentSong, upNext = [], contextName, isPlaying, repeatMode = 'off', onPlaySong, likedIds = [], onToggleLike }) {
  return (
    <section className="surface animate-slide-in overflow-hidden rounded-[1.75rem] p-4 sm:p-5" aria-label="Playback queue">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="wave" size={17} className="text-cyan-300" />
          <h2 className="text-sm font-extrabold tracking-tight text-white">Queue</h2>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-zinc-400">{upNext.length} up next</span>
      </div>

      {currentSong ? (
        <>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500/15 to-cyan-500/[0.07] p-3 ring-1 ring-inset ring-purple-400/15">
            <CoverArt item={currentSong} className="h-12 w-12 flex-none" rounded="rounded-xl" glyph={false} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[10px] font-bold uppercase tracking-wider text-purple-300">Now playing</p>
                {repeatMode === 'one' ? (
                  <span className="flex flex-none items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-200" title="This song is repeating">
                    <Icon name="repeatOne" size={10} /> One
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 truncate text-xs font-bold text-white">{currentSong.title}</p>
              <p className="truncate text-[11px] text-zinc-500">{currentSong.artist}</p>
            </div>
            <div className="flex flex-none items-center gap-1">
              <button
                type="button"
                className={`btn-icon h-8 w-8 ${likedIds.includes(currentSong.id) ? 'text-rose-400' : ''}`}
                onClick={() => onToggleLike?.(currentSong)}
                aria-label={`${likedIds.includes(currentSong.id) ? 'Unlike' : 'Like'} ${currentSong.title}`}
                aria-pressed={likedIds.includes(currentSong.id)}
                title={likedIds.includes(currentSong.id) ? 'Unlike' : 'Like'}
              >
                <Icon name="heart" size={15} className={likedIds.includes(currentSong.id) ? 'fill-current' : ''} />
              </button>
              {isPlaying ? <Equalizer active className="flex-none" /> : null}
            </div>
          </div>
          <p className="mt-3 truncate text-[11px] text-zinc-500">Playing from <span className="font-semibold text-zinc-300">{contextName || 'Your library'}</span></p>
        </>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/[0.03] p-4 text-center text-xs leading-relaxed text-zinc-500">Pick a song to start your queue.</p>
      )}

      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <p className="pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Up next</p>
        {upNext.length ? (
          <div className="scroll-thin max-h-56 space-y-1 overflow-y-auto pr-1">
            {upNext.map((song, index) => (
              <button
                key={`${song.id}-${index}`}
                type="button"
                onClick={() => onPlaySong(song)}
                className="flex w-full min-w-0 items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition-colors hover:bg-white/[0.055]"
              >
                <span className="w-4 flex-none text-center text-[10px] font-semibold text-zinc-600">{index + 1}</span>
                <CoverArt item={song} className="h-8 w-8 flex-none" rounded="rounded-lg" glyph={false} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-zinc-200">{song.title}</span>
                  <span className="block truncate text-[10px] text-zinc-600">{song.artist}</span>
                </span>
                <Icon name="play" size={12} className="flex-none text-zinc-600" />
              </button>
            ))}
          </div>
        ) : (
          <p className="px-1 py-2 text-[11px] text-zinc-600">Nothing else queued right now.</p>
        )}
      </div>
    </section>
  )
}
