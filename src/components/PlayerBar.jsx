import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'
import { formatTime } from '../utils/format.js'

export default function PlayerBar({
  currentSong,
  isPlaying,
  progress = 0,
  volume = 70,
  shuffle = false,
  repeatMode = 'off',
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onCycleRepeat,
  isLiked = false,
  onToggleLike,
}) {
  const duration = currentSong?.duration || 0
  const progressPercent = duration ? Math.min(100, (progress / duration) * 100) : 0
  const volumeIcon = volume === 0 ? 'volumeMute' : volume < 45 ? 'volumeLow' : 'volume'
  const repeatTitle = repeatMode === 'off'
    ? 'Repeat off — click for repeat all'
    : repeatMode === 'all'
      ? 'Repeat all — click for repeat one'
      : 'Repeat one — click for off'

  return (
    <footer className="surface z-40 flex-none border-x-0 border-b-0 px-3 py-2.5 sm:px-5 sm:py-3 lg:px-6" aria-label="Music player">
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-white/[0.06] lg:hidden" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          {currentSong ? (
            <>
              <div className="relative h-11 w-11 flex-none sm:h-14 sm:w-14">
                <CoverArt item={currentSong} className="h-full w-full" rounded="rounded-xl" glyph={false} />
                {isPlaying && <span className="absolute inset-0 rounded-xl ring-2 ring-purple-400/50 soft-pulse" aria-hidden="true" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-bold text-white sm:text-sm">{currentSong.title}</p>
                  {repeatMode === 'one' ? (
                    <span className="flex flex-none items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-cyan-200" title="This song is repeating">
                      <Icon name="repeatOne" size={11} /> One
                    </span>
                  ) : null}
                  {isPlaying ? <Equalizer active className="hidden h-3 flex-none sm:inline-flex" /> : null}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500 sm:text-xs">{currentSong.artist} · {currentSong.album}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white/[0.05] text-zinc-600 sm:h-14 sm:w-14">
                <Icon name="music" size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-zinc-300">Nothing playing yet</p>
                <p className="mt-0.5 text-[11px] text-zinc-600">Choose a song to begin</p>
              </div>
            </>
          )}
          <button
            type="button"
            className={`btn-icon h-9 w-9 flex-none ${isLiked ? 'text-rose-400' : 'text-zinc-400'}`}
            onClick={() => onToggleLike?.(currentSong)}
            disabled={!currentSong}
            aria-label={isLiked ? 'Unlike current song' : 'Like current song'}
            aria-pressed={isLiked}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Icon name="heart" size={18} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5 lg:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              className={`btn-icon h-8 w-8 ${shuffle ? 'active' : ''}`}
              onClick={onToggleShuffle}
              aria-label="Toggle shuffle"
              aria-pressed={shuffle}
              title="Shuffle"
            >
              <Icon name="shuffle" size={16} />
            </button>
            <button type="button" className="btn-icon h-9 w-9" onClick={onPrevious} disabled={!currentSong} aria-label="Previous song">
              <Icon name="skipBack" size={18} />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              disabled={!currentSong}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-700 text-white shadow-[0_8px_22px_rgba(124,58,237,0.35)] transition-all duration-200 hover:scale-110 active:scale-95 sm:h-11 sm:w-11"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying && <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" aria-hidden="true" />}
              <Icon name={isPlaying ? 'pause' : 'play'} size={19} className={`relative ${isPlaying ? '' : 'ml-0.5'}`} />
            </button>
            <button type="button" className="btn-icon h-9 w-9" onClick={onNext} disabled={!currentSong} aria-label="Next song">
              <Icon name="skipForward" size={18} />
            </button>
            <button
              type="button"
              className={`btn-icon h-8 w-8 ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={onCycleRepeat}
              aria-label={`Repeat mode: ${repeatMode}. Click to change.`}
              aria-pressed={repeatMode !== 'off'}
              title={repeatTitle}
            >
              <Icon name={repeatMode === 'one' ? 'repeatOne' : 'repeat'} size={16} />
            </button>
          </div>

          <div className="hidden w-full items-center gap-3 lg:flex">
            <span className="w-9 text-right text-[10px] font-medium tabular-nums text-zinc-500">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              step="1"
              value={Math.min(progress, duration)}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="range"
              style={{ '--fill': `${progressPercent}%` }}
              aria-label="Seek through song"
              disabled={!currentSong}
            />
            <span className="w-9 text-[10px] font-medium tabular-nums text-zinc-500">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{currentSong ? 'Up next ready' : 'Ready when you are'}</span>
          <button type="button" className="btn-icon h-8 w-8" onClick={() => onVolumeChange(volume === 0 ? 70 : 0)} aria-label={volume === 0 ? 'Unmute' : 'Mute'}>
            <Icon name={volumeIcon} size={18} />
          </button>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="range w-24"
            style={{ '--fill': `${volume}%` }}
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  )
}
