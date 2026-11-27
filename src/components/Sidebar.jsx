import React from 'react'
import Icon from './Icon.jsx'
import CoverArt from './CoverArt.jsx'
import Equalizer from './Equalizer.jsx'

const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'liked', label: 'Liked Songs', icon: 'heart' },
  { id: 'discover', label: 'Discover', icon: 'compass' },
  { id: 'library', label: 'Your Library', icon: 'library' },
  { id: 'playlists', label: 'Your Playlists', icon: 'list' },
  { id: 'recent', label: 'Recently Played', icon: 'clock' },
]

export default function Sidebar({
  activeView,
  onNavigate,
  onCreatePlaylist,
  playlists = [],
  likedCount = 0,
  selectedPlaylistId,
  onOpenPlaylist,
  mobileOpen,
  onCloseMobile,
  collapsed = false,
  onToggleCollapse,
  currentSong,
  isPlaying,
}) {
  const [isDesktop, setIsDesktop] = React.useState(() => window.innerWidth >= 1024)
  const [tooltip, setTooltip] = React.useState(null)

  React.useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = (event) => setIsDesktop(event.matches)
    update(query)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  React.useEffect(() => {
    setTooltip(null)
  }, [collapsed, isDesktop, mobileOpen])

  const rail = collapsed && isDesktop

  const showTip = (event, label) => {
    if (!rail) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltip({ label, left: rect.right + 10, top: rect.top + rect.height / 2 })
  }

  const hideTip = () => setTooltip(null)
  const tipProps = (label) => (rail
    ? {
        onMouseEnter: (event) => showTip(event, label),
        onMouseLeave: hideTip,
        onFocus: (event) => showTip(event, label),
        onBlur: hideTip,
      }
    : {})

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`scroll-thin fixed bottom-[77px] left-0 top-0 z-50 flex w-[286px] flex-col overflow-y-auto border-r border-white/[0.06] bg-[#101019]/98 backdrop-blur-xl transition-[transform,width] duration-300 ease-out lg:static lg:bottom-auto lg:z-auto lg:h-full lg:translate-x-0 ${rail ? 'lg:w-[76px]' : 'lg:w-[250px] xl:w-[268px]'} ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        aria-label="Main navigation"
      >
        <div className={`flex h-[76px] flex-none items-center ${rail ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <button
            type="button"
            onClick={() => {
              onNavigate('home')
              onCloseMobile()
            }}
            className={`group flex items-center ${rail ? 'justify-center' : 'gap-3'}`}
            aria-label="SONORA home"
            {...tipProps('SONORA home')}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-transform duration-300 group-hover:rotate-6">
              <Icon name="logo" size={21} className="text-white" strokeWidth={2.1} />
              <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" aria-hidden="true" />
            </span>
            {!rail && (
              <span className="text-left">
                <span className="block text-lg font-extrabold leading-none tracking-[0.16em] text-white">SONORA</span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Your music universe</span>
              </span>
            )}
          </button>
          <button type="button" className="btn-icon lg:hidden" onClick={onCloseMobile} aria-label="Close navigation">
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className={`mt-2 flex-none space-y-1 ${rail ? 'px-3' : 'px-4'}`} aria-label="Views">
          {!rail && <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Explore</p>}
          {navItems.map((item) => {
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  onCloseMobile()
                }}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex w-full items-center rounded-xl py-2.5 text-left text-sm font-semibold transition-all duration-200 ${rail ? 'justify-center px-0' : 'gap-3 px-3'} ${active ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-zinc-400 hover:bg-white/[0.045] hover:text-white'}`}
                {...tipProps(item.label)}
              >
                {active && (
                  <span className={`absolute top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-purple-400 to-cyan-400 ${rail ? '-left-3' : '-left-4'}`} aria-hidden="true" />
                )}
                <Icon name={item.icon} size={19} className={active ? 'text-purple-300' : 'text-zinc-500 transition-colors group-hover:text-zinc-300'} />
                {!rail && <span className="truncate">{item.label}</span>}
                {!rail && item.id === 'liked' && likedCount ? (
                  <span className="ml-auto rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">{likedCount}</span>
                ) : !rail && active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                ) : null}
              </button>
            )
          })}
        </nav>

        <div className={`mt-7 flex-none ${rail ? 'px-3' : 'px-4'}`}>
          <button
            type="button"
            onClick={() => {
              onCreatePlaylist()
              onCloseMobile()
            }}
            className={`btn-primary justify-center ${rail ? 'sidebar-rail-action mx-auto' : 'w-full py-3 text-[13px]'}`}
            aria-label="Create playlist"
            {...tipProps('Create playlist')}
          >
            <Icon name="plus" size={17} strokeWidth={2.4} />
            {!rail && 'Create playlist'}
          </button>
        </div>

        <div className={`mt-7 flex flex-col ${rail ? 'px-3' : 'px-4'}`}>
          {rail ? (
            <div className="mx-auto mb-3 h-px w-8 bg-white/10" aria-hidden="true" />
          ) : (
            <div className="flex items-center justify-between px-3 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Your playlists</p>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-zinc-400">{playlists.length}</span>
            </div>
          )}
          <div className="space-y-1 pb-4">
            {playlists.length ? (
              playlists.slice(0, 8).map((playlist) => {
                const active = selectedPlaylistId === playlist.id && activeView === 'playlists'
                return (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => {
                      onOpenPlaylist(playlist)
                      onCloseMobile()
                    }}
                    aria-label={playlist.name}
                    className={`flex w-full items-center rounded-xl p-2 text-left transition-colors ${rail ? 'justify-center' : 'gap-3'} ${active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'}`}
                    {...tipProps(playlist.name)}
                  >
                    <CoverArt item={playlist} className="h-9 w-9 flex-none" rounded="rounded-lg" glyph={false} />
                    {!rail && (
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[13px] font-semibold ${active ? 'text-white' : 'text-zinc-300'}`}>{playlist.name}</span>
                        <span className="block text-[11px] text-zinc-500">{playlist.songIds.length} songs</span>
                      </span>
                    )}
                    {!rail && active && currentSong && isPlaying ? <Equalizer active className="h-3 flex-none" /> : null}
                  </button>
                )
              })
            ) : rail ? null : (
              <p className="px-3 py-3 text-xs leading-relaxed text-zinc-600">Your playlists will appear here.</p>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 pt-0">
          {!rail && (
            <div className="surface-soft relative overflow-hidden rounded-2xl p-4">
              <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" aria-hidden="true" />
              <div className="relative flex items-center gap-2 text-purple-300">
                <Icon name="sparkles" size={16} />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Sonora+</span>
              </div>
              <p className="relative mt-2 text-xs leading-relaxed text-zinc-400">Unlimited playlists, lossless sound and curated mixes.</p>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={rail ? 'btn-icon mx-auto mt-1 h-10 w-10 border border-white/10' : 'mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'}
            aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
            {...tipProps(rail ? 'Expand sidebar' : 'Collapse sidebar')}
          >
            <Icon name={rail ? 'chevronRight' : 'chevronLeft'} size={16} />
            {!rail && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      {rail && tooltip && (
        <div
          className="pointer-events-none fixed z-[60] animate-fade-in rounded-lg border border-white/10 bg-[#171722] px-2.5 py-1.5 text-xs font-semibold text-white shadow-xl"
          style={{ left: tooltip.left, top: tooltip.top, transform: 'translateY(-50%)' }}
          role="tooltip"
        >
          {tooltip.label}
        </div>
      )}
    </>
  )
}
