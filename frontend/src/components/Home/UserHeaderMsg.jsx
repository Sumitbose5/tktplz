export const UserHeaderMsg = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
            Demo
          </span>
          <p className="text-slate-200 truncate sm:whitespace-normal">
            <strong className="text-white font-semibold">Select Jamshedpur</strong> to explore events.
            <span className="hidden sm:inline text-slate-300"> This is a demo platform, so events are currently only populated for Jamshedpur.</span>
          </p>
        </div>

        <span className="shrink-0 text-[10px] sm:text-xs text-indigo-300/80 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          Jamshedpur Only
        </span>
      </div>
    </div>
  );
};