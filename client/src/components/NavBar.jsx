import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-gray-800">
        📖 BlogSpace
      </Link>
      <Link
        to="/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
      >
        + New Post
      </Link>
    </nav>
  );
}
