import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Camera, Search, Smartphone, Apple, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-block bg-white/70 text-orange-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
            Food classification + calorie lookup
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Know your food. Track every{" "}
            <span className="text-orange-600">calorie.</span>
          </h1>
          <p className="mt-5 text-gray-600 text-lg max-w-md">
            Snap a photo, identify what’s on your plate, and look up calories
            instantly. NutriScan makes healthy eating effortless — right from
            your phone.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-full transition"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 hover:border-orange-400 text-gray-700 font-medium px-6 py-3 rounded-full transition"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Hero Image Area */}
        <div className="flex-1 relative">
          <div className="bg-white rounded-3xl shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-sm font-medium px-3 py-1 rounded-full shadow">
              ~520 kcal
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🍓</div>
              <div className="bg-green-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🥬</div>
              <div className="bg-amber-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🥜</div>
              <div className="bg-yellow-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🌾</div>
              <div className="bg-red-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🍅</div>
              <div className="bg-orange-50 rounded-2xl h-24 flex items-center justify-center text-3xl">🥑</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to eat smarter</h2>
          <p className="mt-3 text-gray-600">Simple tools that turn any meal into clear nutrition data.</p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-2xl p-8 text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Camera className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg">Food classification</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Point your camera at a meal and NutriScan identifies each ingredient in seconds.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg">Calorie lookup</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Get instant calorie and macro estimates for thousands of dishes and ingredients.
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg">Built for your phone</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Works smoothly on mobile, so you can log meals anywhere — kitchen, café, or gym.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-soft-orange">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mt-3 text-gray-600">Three steps, straight from your phone.</p>

          <div className="mt-14 flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="text-orange-600" size={28} />
              </div>
              <p className="text-sm font-medium text-orange-600">STEP 1</p>
              <h3 className="font-semibold text-lg mt-1">Snap</h3>
              <p className="text-gray-600 text-sm mt-1">Take a photo of your food</p>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-orange-200"></div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Apple className="text-orange-600" size={28} />
              </div>
              <p className="text-sm font-medium text-orange-600">STEP 2</p>
              <h3 className="font-semibold text-lg mt-1">Classify</h3>
              <p className="text-gray-600 text-sm mt-1">We identify the dish and ingredients</p>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-orange-200"></div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="text-orange-600" size={28} />
              </div>
              <p className="text-sm font-medium text-orange-600">STEP 3</p>
              <h3 className="font-semibold text-lg mt-1">Track</h3>
              <p className="text-gray-600 text-sm mt-1">See calories and macros instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold">Start tracking in seconds</h2>
          <p className="mt-3 text-orange-100">Create a free account and classify your first meal today.</p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-orange-600 font-medium px-8 py-3 rounded-full hover:bg-orange-50 transition"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}
