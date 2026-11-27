import React from 'react'
import Icon from './Icon.jsx'
import SearchBar from './SearchBar.jsx'

function getMoment() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return { greeting: 'Good morning', mood: 'Fresh start mix' }
  if (hour >= 12 && hour < 17) return { greeting: 'Good afternoon', mood: 'Focus mode' }
  if (hour >= 17 && hour < 22) return { greeting: 'Good evening', mood: 'Wind-down picks' }
  return { greeting: 'Good night', mood: 'Late-night picks' }
}

export default function Header({ onMenu, search, results, onPlaySong, onSearchSubmit }) {
  const [moment, setMoment] = React.useState(getMoment)

  React.useEffect(() => {
    const timer = setInterval(() => setMoment(getMoment()), 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="header-shell sticky top-0 z-30 overflow-hidden px-4 pb-4 pt-5 backdrop-blur-xl sm:px-6 lg:px-8 lg:pb-5 lg:pt-6 xl:px-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="header-orb header-orb-a" />
        <span className="header-orb header-orb-b" />
      </div>
      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" className="btn-icon flex-none border border-white/10 lg:hidden" onClick={onMenu} aria-label="Open navigation">
            <Icon name="menu" size={19} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="header-eyebrow">
                <Icon name="sparkles" size={12} />
                Your personal soundscape
              </span>
              <span className="hidden items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200 sm:inline-flex">
                <span className="flex h-2.5 items-end gap-[2px]" aria-hidden="true">
                  <i className="eq-bar" /><i className="eq-bar" /><i className="eq-bar" />
                </span>
                {moment.mood}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2.5">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {moment.greeting},  <span className="text-gradient">Music Lover</span>
              </h1>
              <span className="hidden h-5 flex-none items-end gap-[3px] sm:flex" aria-hidden="true">
                <i className="eq-bar" /><i className="eq-bar" /><i className="eq-bar" /><i className="eq-bar" />
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl xl:flex-1 xl:max-w-md">
          <SearchBar
            value={search.value}
            onChange={search.onChange}
            onSubmit={onSearchSubmit}
            results={results}
            onPlaySong={onPlaySong}
          />
        </div>

        <div className="hidden items-center gap-3 flex-none xl:flex">
          <span className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500/15 to-cyan-500/10 px-3 py-1.5 text-[11px] font-bold text-purple-100 shadow-[0_0_22px_rgba(168,85,247,0.14)]">
            <Icon name="sparkles" size={13} className="text-cyan-300" />
            Premium member
          </span>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-xs font-extrabold text-white ring-2 ring-white/15" aria-label="Music Lover profile">
            ML
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#09090F] bg-emerald-400" aria-hidden="true" />
          </span>
        </div>
      </div>
    </header>
  )
}
