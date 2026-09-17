import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Settings } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-6 py-3 flex justify-around items-center z-50">
      <Link
        to="/app"
        className={`flex flex-col items-center gap-1 ${
          isActive("/app") ? "text-orange-600" : "text-gray-400"
        }`}
      >
        <Home size={22} />
        <span className="text-xs">Home</span>
      </Link>

      <Link
        to="/chatbot"
        className={`flex flex-col items-center gap-1 ${
          isActive("/chatbot") ? "text-orange-600" : "text-gray-400"
        }`}
      >
        <MessageCircle size={22} />
        <span className="text-xs">Chatbot</span>
      </Link>

      <Link
        to="/settings"
        className={`flex flex-col items-center gap-1 ${
          isActive("/settings") ? "text-orange-600" : "text-gray-400"
        }`}
      >
        <Settings size={22} />
        <span className="text-xs">Settings</span>
      </Link>
    </div>
  );
}
