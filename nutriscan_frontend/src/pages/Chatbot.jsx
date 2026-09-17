import { useState, useRef, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { Send, Bot, User, Sparkles } from "lucide-react";

const QUICK_QUESTIONS = [
  "How many calories in a samosa?",
  "Is idli healthy for breakfast?",
  "What's the protein in butter chicken?",
  "Suggest a low-calorie Indian meal",
  "Is paneer good for weight loss?",
  "How many carbs in a dosa?",
];

// Simple knowledge base for common nutrition queries
const KNOWLEDGE = {
  samosa: "A typical samosa (~100g) has about **262 kcal**, with 5.2g protein, 32.8g carbs, and 12.8g fat. It's a fried snack — enjoy in moderation!",
  idli: "Idli is one of the healthiest Indian breakfasts! ~90 kcal per piece with 4g protein, almost no fat, and is steamed (not fried). Great choice! ✅",
  "butter chicken": "Butter chicken (~250g serving) has about **438 kcal** with 28g protein. It's protein-rich but high in fat (32g) due to butter and cream. Pair with roti instead of naan to cut calories.",
  paneer: "Paneer is high in protein (~18g per 100g) but also high in fat (~25g). For weight loss, use it in grilled or curry form rather than deep-fried. Portion control is key!",
  dosa: "A plain dosa has ~133 kcal with 25g carbs. Masala dosa is ~210 kcal. It's relatively light — the coconut chutney adds healthy fats!",
  "low-calorie": "Great low-calorie Indian meals:\n• **Idli + sambar** (~180 kcal)\n• **Roti + dal** (~250 kcal)\n• **Poha** (~200 kcal)\n• **Upma** (~190 kcal)\n• **Curd rice** (~220 kcal)",
  biryani: "Chicken biryani (~400g) has about **550 kcal** with 32g protein. It's a complete meal but calorie-dense. Try veg biryani (420 kcal) for a lighter option.",
  pizza: "A typical pizza slice (~150g) has about **270 kcal** with 12g protein and 33g carbs. Limit to 2 slices and pair with a salad for balance.",
  momos: "Steamed momos (~150g, 6 pieces) have about **200 kcal** with 10g protein. Steamed > fried for a healthier choice!",
  chai: "A cup of chai (~200ml) with milk and sugar has about **105 kcal**. Skip the sugar to cut it to ~50 kcal.",
  naan: "Butter naan has about **300 kcal** per piece. Switch to tandoori roti (~80 kcal) to save 220 calories!",
  protein: "High-protein Indian foods:\n• **Chicken tikka** — 32g protein\n• **Dal makhani** — 14g protein\n• **Paneer dishes** — 15-18g protein\n• **Egg curry** — 18g protein\n• **Fish curry** — 28g protein",
};

function getBotReply(message) {
  const lower = message.toLowerCase();

  for (const [key, response] of Object.entries(KNOWLEDGE)) {
    if (lower.includes(key)) {
      return response;
    }
  }

  if (lower.includes("calorie") || lower.includes("kcal")) {
    return "I can help with calorie info! Try asking about a specific dish like 'samosa', 'biryani', 'dosa', or 'butter chicken'. You can also scan food on the Home page for exact results.";
  }

  if (lower.includes("healthy") || lower.includes("diet") || lower.includes("weight")) {
    return "For a healthy Indian diet, focus on:\n• **Steamed over fried** (idli > vada)\n• **Whole grains** (roti > naan)\n• **Balanced thali** with dal, sabzi, roti, salad\n• **Portion control** — especially with rice and sweets\n\nWant me to suggest specific meals?";
  }

  return "I'm your NutriScan nutrition assistant! I can help with:\n• Calorie info for Indian dishes\n• Protein / carb / fat breakdowns\n• Healthy meal suggestions\n• Diet tips\n\nTry asking about a specific dish like **samosa**, **biryani**, or **dosa**! 🍽️";
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your NutriScan assistant 🥗\n\nAsk me about calories, nutrition, or healthy Indian food choices. You can also tap a quick question below!",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text: text.trim() };
    const botReply = { role: "bot", text: getBotReply(text) };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-soft-orange pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-100 to-transparent pt-8 pb-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Bot className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">NutriBot</h1>
            <p className="text-xs text-gray-500">Your nutrition assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === "bot"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-800 text-white"
              }`}
            >
              {msg.role === "bot" ? <Sparkles size={16} /> : <User size={16} />}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "bot"
                  ? "bg-white border border-orange-100 text-gray-800"
                  : "bg-orange-600 text-white"
              }`}
            >
              {msg.text.split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j}>{part}</strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 max-w-lg mx-auto w-full">
          <p className="text-xs font-medium text-gray-400 mb-2 tracking-wide">QUICK QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="bg-white border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-full hover:bg-orange-50 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-20 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any food..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
