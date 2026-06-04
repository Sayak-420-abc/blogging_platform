import { Link } from "react-router-dom";

const GRADIENTS = [
  { bg: "from-violet-500 via-purple-500 to-pink-500",   accent: "bg-violet-500" },
  { bg: "from-blue-600 via-indigo-500 to-purple-500",   accent: "bg-indigo-500" },
  { bg: "from-emerald-400 via-teal-500 to-cyan-600",    accent: "bg-teal-500"   },
  { bg: "from-rose-400 via-pink-500 to-indigo-500",     accent: "bg-rose-500"   },
  { bg: "from-amber-400 via-orange-500 to-rose-500",    accent: "bg-orange-500" },
  { bg: "from-cyan-500 via-sky-500 to-blue-600",        accent: "bg-cyan-500"   },
];

function hashTitle(title = "") {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = title.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % GRADIENTS.length;
}

function AuthorInitials({ name }) {
  const initials = (name || "AN")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-[10px] font-extrabold text-white shadow-sm">
      {initials}
    </span>
  );
}

export default function BlogCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  const wordCount = (post.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const { bg, accent } = GRADIENTS[hashTitle(post.title)];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">

      {/* Colored top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${bg} opacity-80 transition-all duration-300 group-hover:opacity-100`} />

      {/* Cover Image / Gradient Fallback */}
      <div className="relative aspect-video w-full overflow-hidden bg-amber-100 dark:bg-zinc-950">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-tr ${bg} transition-transform duration-500 group-hover:scale-105`}>
            <span className="text-4xl drop-shadow-lg">📝</span>
          </div>
        )}

        {/* Reading time badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime} min
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">

        {/* Author row */}
        <div className="mb-3 flex items-center gap-2">
          <AuthorInitials name={post.author} />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {post.author || "Anonymous"}
            </p>
            <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">{date}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-3 h-px w-full bg-amber-100 dark:bg-zinc-800" />

        {/* Title */}
        <h3
          className="mb-2 text-[17px] font-extrabold leading-snug text-zinc-900 line-clamp-2 transition-colors duration-200 group-hover:text-cyan-600 dark:text-zinc-50 dark:group-hover:text-cyan-400"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {post.title}
        </h3>

        {/* Summary */}
        <p className="mb-4 text-sm leading-relaxed text-zinc-500 line-clamp-2 dark:text-zinc-400">
          {post.summary}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-amber-100 pt-4 dark:border-zinc-800">
          <Link
            to={`/post/${post._id}`}
            className="group/btn inline-flex items-center gap-1.5 rounded-lg border-2 border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-700 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-cyan-500 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-300"
          >
            Read Article
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Word count pill */}
          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
            {wordCount.toLocaleString()} words
          </span>
        </div>
      </div>
    </article>
  );
}
