import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../services/api";

const FieldIcon = ({ children }) => (
  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-500/70 dark:text-zinc-500">
    {children}
  </span>
);

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState("write");
  const [form, setForm] = useState({ title: "", summary: "", content: "", author: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getPostById(id).then((res) => setForm(res.data)).catch(() => navigate("/"));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError("Title, Summary, and Content are required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await updatePost(id, form);
        navigate(`/post/${id}`);
      } else {
        const res = await createPost(form);
        navigate(`/post/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save the post. Please try again.");
      setLoading(false);
    }
  };

  // Shared input class — white bg with strong amber border, distinct from cream page
  const inputBase =
    "w-full rounded-lg border-2 border-amber-300 bg-white px-4 py-2.5 text-[15px] font-medium text-zinc-800 placeholder-amber-300/60 shadow-sm outline-none " +
    "hover:border-amber-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 " +
    "transition-all duration-200 " +
    "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:hover:border-zinc-600 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/10";

  const labelClass =
    "flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-zinc-500 mb-2 dark:text-zinc-400";

  const requiredBadge = (
    <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">
      Required
    </span>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={isEdit ? `/post/${id}` : "/"}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-cyan-600 transition-colors dark:text-zinc-400 dark:hover:text-cyan-400"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 bg-white group-hover:border-cyan-300 group-hover:bg-cyan-50 transition-all dark:border-zinc-700 dark:bg-zinc-900 dark:group-hover:border-cyan-700 dark:group-hover:bg-cyan-950/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </span>
          Cancel and return
        </Link>
      </div>

      {/* Page Header Card */}
      <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-white px-6 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {isEdit ? "Editing Draft" : "New Story"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isEdit ? "Edit Your Story" : "Create a New Story"}
            </h1>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              {isEdit ? "Refine and update your published post." : "Share your ideas with the world."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 self-start rounded-xl border-2 border-amber-200 bg-amber-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setActiveTab("write")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                activeTab === "write"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                activeTab === "preview"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          <span className="mt-0.5 flex-shrink-0 text-lg">⚠️</span>
          {error}
        </div>
      )}

      {/* ── Editor Tab ─────────────────────────── */}
      {activeTab === "write" ? (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <label className={labelClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Post Title {requiredBadge}
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="eg. Demystifying CSS Grid vs Flexbox"
              className={inputBase}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 600 }}
              required
            />
          </div>

          {/* Summary */}
          <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <label className={labelClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              Short Summary {requiredBadge}
            </label>
            <input
              type="text"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="A brief tagline explaining what this article is about."
              className={inputBase}
              required
            />
          </div>

          {/* Content */}
          <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <label className={labelClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Main Content {requiredBadge}
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              placeholder="Write your story here. Use blank lines to separate paragraphs..."
              className={`${inputBase} resize-y`}
              style={{ lineHeight: "1.75" }}
              required
            />
            {form.content && (
              <p className="mt-2 font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
                {form.content.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 200))} min read
              </p>
            )}
          </div>

          {/* Author + Image side by side */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <label className={labelClass}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Author Name
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Anonymous"
                className={inputBase}
              />
            </div>

            <div className="rounded-xl border-2 border-amber-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <label className={labelClass}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Cover Image URL
              </label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={inputBase}
              />
            </div>
          </div>

          {/* Image preview */}
          {form.image && (
            <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
              <p className={labelClass}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 text-cyan-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Cover Preview
              </p>
              <img
                src={form.image}
                alt="preview"
                className="mt-1 h-28 w-full rounded-lg object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 dark:shadow-cyan-900/20"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing your story...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  {isEdit ? "Update & Publish" : "Publish Story"}
                </span>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* ── Preview Tab ───────────────────────── */
        <div className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-100/50 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {form.image ? (
              <img src={form.image} alt="Cover Preview" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600">
                <span className="text-4xl drop-shadow">📝</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest dark:text-zinc-500">
            <span>Just Now</span>
            <span>•</span>
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-[11px] font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">
              {form.author || "Anonymous"}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {form.title || "Untitled Article"}
          </h2>

          <div className="rounded-xl border-l-4 border-cyan-500 bg-cyan-50/60 px-5 py-4 text-zinc-600 text-sm leading-relaxed italic dark:bg-cyan-950/10 dark:text-zinc-400">
            {form.summary || "Your summary will appear here."}
          </div>

          <div className="text-zinc-700 leading-8 whitespace-pre-line border-b-2 border-amber-200 pb-12 dark:text-zinc-300 dark:border-zinc-800">
            {form.content || "Start writing in the Editor tab to preview your content here."}
          </div>
        </div>
      )}
    </div>
  );
}