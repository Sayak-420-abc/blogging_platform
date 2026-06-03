
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../services/api";
import Loader from "../components/Loader";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostById(id)
      .then((res) => setPost(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
    navigate("/");
  };

  if (loading) return <Loader />;
  if (!post) return null;

  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 text-sm hover:underline">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
        {post.title}
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {date} · {post.author || "Anonymous"}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt="cover"
          className="w-full rounded-xl mb-6 object-cover max-h-64"
        />
      )}
      <p className="text-gray-500 italic mb-6">{post.summary}</p>
      <div className="text-gray-700 leading-7 whitespace-pre-line">
        {post.content}
      </div>
      <div className="flex gap-3 mt-8">
        <Link
          to={`/edit/${post._id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
        >
          Edit Post
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}