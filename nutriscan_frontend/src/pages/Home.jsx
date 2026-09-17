import { useState, useRef } from "react";
import BottomNav from "../components/BottomNav";
import { predictFood } from "../api";
import {
  Camera,
  Upload,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Leaf,
  Loader2,
  AlertCircle,
  X,
  ImagePlus,
  Clock,
  Trash2,
} from "lucide-react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriscan_history") || "[]");
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ---- Handle file selection (camera or gallery) ----
  const handleFile = async (file) => {
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictFood(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  // ---- Save to history ----
  const saveToHistory = () => {
    if (!result) return;
    const entry = {
      id: Date.now(),
      dish_name: result.dish_name,
      confidence: result.confidence,
      calories: result.nutrition.calories,
      protein_g: result.nutrition.protein_g,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [entry, ...history].slice(0, 20); // keep last 20
    setHistory(updated);
    localStorage.setItem("nutriscan_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("nutriscan_history");
  };

  const resetScan = () => {
    setResult(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-soft-orange pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-100 to-transparent pt-8 pb-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          What are you eating?
        </h1>
        <p className="text-center text-gray-600 text-sm mt-1">
          Snap or upload a photo and we'll break down the nutrition.
        </p>
      </div>

      <div className="px-6 max-w-lg mx-auto">
        {/* Action Buttons */}
        {!preview && !loading && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col items-center gap-3 hover:shadow-md transition"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Camera className="text-orange-600" size={28} />
              </div>
              <span className="font-medium text-gray-800">Take Photo</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col items-center gap-3 hover:shadow-md transition"
            >
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Upload className="text-yellow-600" size={28} />
              </div>
              <span className="font-medium text-gray-800">Upload File</span>
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          onChange={handleFileInput}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />

        {/* Image Preview */}
        {preview && (
          <div className="mt-4 relative">
            <img
              src={preview}
              alt="Food preview"
              className="w-full h-56 object-cover rounded-2xl border border-orange-100"
            />
            {!loading && (
              <button
                onClick={resetScan}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-white transition"
              >
                <X size={16} className="text-gray-600" />
              </button>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="text-white animate-spin" size={36} />
                <p className="text-white text-sm font-medium">
                  Analyzing your food...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-700 text-sm font-medium">Analysis failed</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={resetScan}
                className="text-red-600 text-sm font-medium underline mt-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Nutrition Breakdown */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wide">
            NUTRITION BREAKDOWN
          </h2>

          {!result && !loading && !error ? (
            <div className="mt-4 bg-white rounded-2xl p-6 text-center border border-orange-50">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ImagePlus className="text-orange-300" size={28} />
              </div>
              <p className="text-gray-500">No meal scanned yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Ingredients will appear here after a scan
              </p>
            </div>
          ) : result ? (
            <div className="mt-4 bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
              {/* Dish name + confidence */}
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg text-gray-900">
                  {result.dish_name}
                </h3>
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {Math.round(result.confidence * 100)}% match
                </span>
              </div>

              {/* Top-3 predictions */}
              {result.top_3 && result.top_3.length > 1 && (
                <div className="mt-2 flex gap-2">
                  {result.top_3.slice(1).map((pred) => (
                    <span
                      key={pred.class_name}
                      className="text-xs text-gray-400"
                    >
                      {pred.display_name} ({Math.round(pred.confidence * 100)}%)
                    </span>
                  ))}
                </div>
              )}

              {/* Ingredients */}
              <p className="text-sm text-gray-500 mt-3">
                Identified ingredients
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full"
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Flame className="mx-auto text-orange-500" size={20} />
                  <p className="text-xl font-bold mt-1">
                    {result.nutrition.calories}
                  </p>
                  <p className="text-xs text-gray-500">CALORIES</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Drumstick className="mx-auto text-orange-500" size={20} />
                  <p className="text-xl font-bold mt-1">
                    {result.nutrition.protein_g}g
                  </p>
                  <p className="text-xs text-gray-500">PROTEIN</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Wheat className="mx-auto text-orange-500" size={20} />
                  <p className="text-xl font-bold mt-1">
                    {result.nutrition.carbs_g}g
                  </p>
                  <p className="text-xs text-gray-500">CARBS</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Droplet className="mx-auto text-orange-500" size={20} />
                  <p className="text-xl font-bold mt-1">
                    {result.nutrition.fat_g}g
                  </p>
                  <p className="text-xs text-gray-500">FAT</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Leaf className="mx-auto text-orange-500" size={20} />
                  <p className="text-xl font-bold mt-1">
                    {result.nutrition.fiber_g}g
                  </p>
                  <p className="text-xs text-gray-500">FIBER</p>
                </div>
              </div>

              {/* Message */}
              {result.message && (
                <div className="mt-5 bg-green-50 text-green-700 text-sm rounded-xl p-3 flex items-start gap-2">
                  <span>✓</span>
                  <span>{result.message}</span>
                </div>
              )}

              {/* Note */}
              {result.note && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {result.note}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={saveToHistory}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition"
                >
                  Save to History
                </button>
                <button
                  onClick={resetScan}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl transition"
                >
                  New Scan
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Previous Meals */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide">
              YOUR PREVIOUS MEALS
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-4 bg-white rounded-2xl p-6 text-center border border-orange-50">
              <p className="text-gray-400 text-sm">
                Meals you save will show up here so you can track your week
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl p-4 border border-orange-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.dish_name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-orange-600 font-medium">
                        {entry.calories} kcal
                      </span>
                      <span className="text-xs text-gray-400">
                        {entry.protein_g}g protein
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
