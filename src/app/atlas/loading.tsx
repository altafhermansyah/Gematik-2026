export default function AtlasLoading() {
  return (
    <main
      role="status"
      aria-label="Loading atlas content"
      className="min-h-screen bg-slate-950 text-slate-100"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 rounded bg-slate-800/80" />
          <div className="mt-2.5 h-4 w-96 max-w-full rounded bg-slate-800/50" />
        </div>

        {/* 2-column layout matching AtlasExplorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Globe area skeleton */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <div className="aspect-square w-full max-w-[720px] rounded-full border border-slate-800/50 bg-slate-900/40 flex items-center justify-center">
              <div className="h-1/2 w-1/2 rounded-full border border-dashed border-slate-800" />
            </div>
          </div>

          {/* Details & list column skeleton */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            {/* Panel skeleton */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-slate-800" />
                <div className="h-4 w-16 rounded bg-slate-800" />
              </div>
              <div className="h-6 w-3/4 rounded bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-slate-800/60" />
                <div className="h-3.5 w-5/6 rounded bg-slate-800/60" />
              </div>
            </div>

            {/* List skeleton */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="h-4 w-20 rounded bg-slate-800" />
              <div className="divide-y divide-slate-800/60 border-y border-slate-800/60">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="py-3.5 px-3 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-1/2 rounded bg-slate-800/70" />
                      <div className="h-3 w-12 rounded bg-slate-800/50" />
                    </div>
                    <div className="h-3 w-24 rounded bg-slate-800/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading atlas data...</span>
    </main>
  );
}
