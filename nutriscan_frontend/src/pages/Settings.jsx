import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { User as UserIcon, Target, Leaf, Moon, Sun, Info, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("nutriscan_user") || "{}");

  const [name, setName] = useState(stored.name || "NutriScan User");
  const [calorieGoal, setCalorieGoal] = useState(stored.calorieGoal || 2000);
  const [diet, setDiet] = useState(stored.diet || "any");
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const user = { ...stored, name, calorieGoal, diet };
    localStorage.setItem("nutriscan_user", JSON.stringify(user));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("nutriscan_user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-soft-orange pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-100 to-transparent pt-8 pb-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Settings</h1>
        <p className="text-center text-gray-600 text-sm mt-1">
          Personalize your NutriScan experience
        </p>
      </div>

      <div className="px-6 max-w-lg mx-auto space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <UserIcon className="text-orange-600" size={28} />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-semibold text-lg text-gray-900 bg-transparent border-b border-transparent focus:border-orange-400 focus:outline-none w-full transition"
              />
              <p className="text-sm text-gray-500 mt-0.5">{stored.email || "user@nutriscan.app"}</p>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target className="text-orange-600" size={20} />
            </div>
            <h2 className="font-semibold text-gray-900">Daily Calorie Goal</h2>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              className="flex-1 accent-orange-500"
            />
            <span className="text-lg font-bold text-orange-600 min-w-[80px] text-right">
              {calorieGoal} kcal
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            <span>1200</span>
            <span>4000</span>
          </div>
        </div>

        {/* Diet Preference */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="text-green-600" size={20} />
            </div>
            <h2 className="font-semibold text-gray-900">Diet Preference</h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "any", label: "Any", emoji: "🍽️" },
              { value: "veg", label: "Vegetarian", emoji: "🥬" },
              { value: "vegan", label: "Vegan", emoji: "🌱" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDiet(opt.value)}
                className={`rounded-xl py-3 text-sm font-medium transition border ${
                  diet === opt.value
                    ? "bg-orange-50 border-orange-400 text-orange-700"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
                }`}
              >
                <span className="text-lg block">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                {darkMode ? <Moon className="text-purple-600" size={20} /> : <Sun className="text-yellow-600" size={20} />}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Dark Mode</h2>
                <p className="text-xs text-gray-500">Coming soon</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                darkMode ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Info className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">About NutriScan</h2>
                <p className="text-xs text-gray-500">v1.0.0 • Food classification + calorie lookup</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300" size={20} />
          </div>
        </div>

        {/* Save & Logout */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSave}
            className={`w-full font-medium py-3 rounded-xl transition ${
              saved
                ? "bg-green-500 text-white"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-red-200 text-red-600 font-medium py-3 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
