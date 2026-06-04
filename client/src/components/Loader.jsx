export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center py-32 space-y-4">
      <div className="relative flex items-center justify-center h-16 w-16">
        {/* Outer pulsing ring */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
        
        {/* Inner spinning gradient ring */}
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin dark:border-slate-800 dark:border-t-indigo-500"></div>
        
        {/* Center dot */}
        <div className="absolute h-3 w-3 rounded-full bg-violet-600"></div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 animate-pulse dark:text-slate-500">
        Fetching stories...
      </p>
    </div>
  );
}
