
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../services/api";
import Loader from "../components/Loader";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive local states (Likes & Comments)
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Calculate dynamic reading time
  const wordCount = (post?.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Helper to generate a consistent, beautiful gradient based on the post title
  const getGradientHeader = (title = "BlogSpace") => {
    const gradients = [
      "from-violet-500 via-purple-500 to-pink-500",
      "from-blue-600 via-indigo-500 to-purple-500",
      "from-emerald-400 via-teal-500 to-cyan-600",
      "from-rose-400 via-pink-500 to-indigo-500",
      "from-amber-400 via-orange-500 to-rose-500",
      "from-cyan-500 via-sky-500 to-blue-600",
    ];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  useEffect(() => {
    getPostById(id)
      .then((res) => {
        setPost(res.data);
        
        // Initialize deterministic likes count based on title length/content
        const titleLength = res.data.title?.length || 10;
        const initialLikes = Math.abs((titleLength * 7) % 89) + 12;
        setLikes(initialLikes);

        // Prepopulate comments
        setComments([
          {
            id: 1,
            author: "Sarah Connor",
            text: "This was a really insightful read! I loved the structure and how clearly you explained the core concepts. Looking forward to your next write-up.",
            date: "Yesterday",
          },
          {
            id: 2,
            author: "Devon M.",
            text: "Excellent summary. Clean UI and formatting makes it so much easier to read. Keep it up!",
            date: "2 hours ago",
          }
        ]);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setDeleting(false);
      setDeleteConfirm(false);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: commentAuthor.trim(),
      text: commentText.trim(),
      date: "Just now",
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setCommentAuthor("");
    setCommentText("");
  };

  if (loading) return <Loader />;
  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">

      {/* ── Delete Confirmation Modal ─────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border-2 border-red-200 bg-white p-6 shadow-2xl dark:border-red-900/40 dark:bg-zinc-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-red-600 dark:text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="mb-1 text-lg font-extrabold text-zinc-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Delete this post?
            </h3>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              This action is <strong className="text-zinc-700 dark:text-zinc-300">permanent</strong> and cannot be undone. The post will be removed from the database immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-xl border-2 border-zinc-200 bg-white py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to feed
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${post._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Main Article */}
      <article>
        {/* Cover Image/Header banner */}
        <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-amber-100/50 shadow-md dark:bg-zinc-950 dark:border dark:border-zinc-800">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-tr ${getGradientHeader(post.title)} p-8`}>
              <span className="text-5xl filter drop-shadow">📝</span>
            </div>
          )}
        </div>

        {/* Article Metadata */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-400 dark:text-slate-500">
          <span>{date}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
          <span>•</span>
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/30 dark:text-indigo-400 dark:ring-indigo-500/20">
            {post.author || "Anonymous"}
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-6 dark:text-slate-50">
          {post.title}
        </h1>

        {/* Summary Card */}
        <div className="mb-8 rounded-2xl border-l-4 border-cyan-500 bg-amber-50 px-5 py-4 text-zinc-600 text-sm leading-relaxed italic shadow-sm dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-cyan-500">
          {post.summary}
        </div>

        {/* Main Body Content */}
        <div className="text-zinc-700 leading-8 text-[16px] whitespace-pre-line border-b border-amber-200 pb-12 dark:text-zinc-300 dark:border-zinc-800">
          {post.content}
        </div>
      </article>

      {/* Interactive Actions (Likes & Engagement) */}
      <div className="flex items-center gap-4 py-8 border-b border-amber-200 dark:border-zinc-800">
        <button
          onClick={handleLike}
          className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
            liked
              ? "bg-rose-50 text-rose-600 ring-1 ring-rose-500/30 scale-105 dark:bg-rose-950/20 dark:text-rose-400"
              : "bg-amber-100/60 text-zinc-600 hover:bg-amber-200/60 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={liked ? 0 : 2}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${liked ? "text-rose-500" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          {likes} Likes
        </button>
      </div>

      {/* Comments Section */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900 mb-6 dark:text-slate-50 font-display">Discussion ({comments.length})</h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <input
                type="text"
                placeholder="Name"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-[#FFFDF0] px-3 py-2 text-sm text-zinc-800 placeholder-amber-400/70 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-cyan-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-[#FFFDF0] px-3 py-2 text-sm text-zinc-800 placeholder-amber-400/70 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-cyan-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition dark:bg-amber-50 dark:text-zinc-900 dark:hover:bg-amber-100"
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-amber-50/70 p-4 border border-amber-100 dark:bg-zinc-900/40 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{comment.author}</span>
                <span className="text-xs text-slate-405 dark:text-slate-500">{comment.date}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}