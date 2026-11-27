import React from 'react'

function Bar({ className = '' }) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />
}

export default function LoadingSkeleton({ variant = 'row', count = 5 }) {
  if (variant === 'hero') {
    return (
      <div className="surface relative h-[300px] overflow-hidden rounded-[2rem] p-6 sm:h-[340px] sm:p-10" aria-label="Loading featured playlist">
        <Bar className="h-4 w-28" />
        <Bar className="mt-8 h-12 w-2/3 max-w-sm" />
        <Bar className="mt-4 h-4 w-full max-w-md" />
        <Bar className="mt-2 h-4 w-1/2 max-w-sm" />
        <Bar className="mt-8 h-11 w-32 rounded-full" />
        <Bar className="absolute -bottom-6 right-8 h-52 w-52 rounded-3xl" />
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-label="Loading songs">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="surface rounded-[1.5rem] p-3">
            <Bar className="aspect-square w-full rounded-2xl" />
            <Bar className="mt-4 h-4 w-3/4" />
            <Bar className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="surface space-y-1 rounded-3xl p-3" aria-label="Loading songs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-2 py-2.5">
          <Bar className="h-4 w-4" />
          <Bar className="h-11 w-11 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Bar className="h-3.5 w-1/3 min-w-24" />
            <Bar className="h-3 w-1/5 min-w-16" />
          </div>
          <Bar className="hidden h-3 w-24 md:block" />
          <Bar className="h-3 w-10" />
        </div>
      ))}
    </div>
  )
}
