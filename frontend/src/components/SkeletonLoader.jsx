export default function SkeletonLoader({ lines = 3, className = '' }) {
  const widths = ['w-3/4', 'w-full', 'w-2/3', 'w-5/6', 'w-1/2', 'w-4/5'];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Avatar skeleton */}
        <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2.5 pt-0.5">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`skeleton h-3.5 rounded ${widths[i % widths.length]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-3 pt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="skeleton w-4 h-4 rounded flex-shrink-0" />
          <div className={`skeleton h-3 rounded flex-1 ${i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-full' : 'w-2/3'}`} />
        </div>
      ))}
    </div>
  );
}
