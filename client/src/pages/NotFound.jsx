import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <div className="relative mb-6 inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 text-4xl font-extrabold text-indigo-600 shadow-inner dark:from-indigo-500/15 dark:to-violet-500/15 dark:text-indigo-400">
        404
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500"></span>
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
        Page Not Found
      </h1>
      <p className="mt-3 text-slate-500 leading-relaxed dark:text-slate-400">
        Sorry, the page you are looking for doesn't exist or has been moved to a new destination.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 dark:shadow-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}





