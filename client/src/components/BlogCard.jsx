import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-md transition">
      <p className="text-xs text-gray-400 mb-1">
        {date} · {post.author || "Anonymous"}
      </p>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.summary}</p>
      <Link
        to={`/post/${post._id}`}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        Read more →
      </Link>
    </div>
  );
}
