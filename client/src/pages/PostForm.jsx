import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../services/api";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "", summary: "", content: "", author: "", image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getPostById(id).then((res) => setForm(res.data)).catch(() => navigate("/"));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError(err.response?.data?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Post" : "Create New Post"}
      </h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Enter post title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Summary *</label>
          <input name="summary" value={form.summary} onChange={handleChange} className={inputClass} placeholder="Short description" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Content *</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={8} className={inputClass} placeholder="Write your post..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Author</label>
          <input name="author" value={form.author} onChange={handleChange} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Image URL (optional)</label>
          <input name="image" value={form.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}