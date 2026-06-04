import { useEffect, useState } from "react";
import { getAllPosts } from "../services/api";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPosts()
      .then((res) => setPosts(res.data))
      .catch(() => setError("Failed to load posts. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const handleClearSearch = () => setSearchQuery("");

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const summaryMatch = post.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = post.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || summaryMatch || authorMatch;
  });

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 mb-4">
          ⚠️
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative mb-12 overflow-hidden rounded-3xl border-2 border-amber-200 bg-white px-6 py-12 sm:px-12 sm:py-16 shadow-lg shadow-amber-100/60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none">
        {/* Light mode decorative blobs */}
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl dark:bg-cyan-600/10" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl dark:bg-indigo-600/10" />
        {/* Dark mode radial overlay */}
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-zinc-900 to-zinc-950 opacity-80 dark:block" />

        <div className="relative z-10 max-w-2xl text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Welcome to BlogSpace
          </span>
          <h1
            className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Discover Stories &amp;{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">
              Creative Ideas
            </span>
          </h1>
          <p className="mt-4 text-base text-zinc-500 leading-relaxed dark:text-zinc-400">
            Write about your developer journey, design systems, tech trends, or anything else you're passionate about.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-cyan-400 to-blue-500" />
            <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">Share your knowledge with the world</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-955 dark:text-slate-50">Featured Articles</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Explore our latest written logs</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts or authors..."
            className="w-full rounded-xl border border-amber-200 bg-[#FFFDF0] py-2 pl-9 pr-8 text-sm text-zinc-800 placeholder-amber-400/80 outline-none hover:border-amber-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/30"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-450 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-200 bg-[#FFFDF0]/60 px-6 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100/60 text-amber-700 mb-4 dark:bg-zinc-900 dark:text-zinc-500">
            🔎
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No posts found</h3>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {searchQuery ? "Try checking your spelling or adjusting your keywords." : "Start by writing the very first post on our blog!"}
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-4 rounded-xl border border-amber-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-amber-100 transition dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
