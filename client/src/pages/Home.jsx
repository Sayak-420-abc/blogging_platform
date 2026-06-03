import { useEffect, useState } from "react";
import { getAllPosts } from "../services/api";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPosts()
      .then((res) => setPosts(res.data))
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          No posts yet. Create one!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
