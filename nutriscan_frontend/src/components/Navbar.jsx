import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="font-semibold text-lg text-gray-900">NutriScan</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        <a href="#features" className="hover:text-orange-600">Features</a>
        <a href="#how-it-works" className="hover:text-orange-600">How it works</a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600">
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
