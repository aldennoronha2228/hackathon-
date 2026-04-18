import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "I want to build a smart home automation system 🏠",
  "Help me design an IoT weather station 🌦️",
  "I need a plant watering system with sensors 🌱",
  "Let's build a motion-triggered security camera 📷",
  "I want an air quality monitor with alerts 💨",
];

export default function ProjectChat({ onIdeationStateChange }) {
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  // auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/project/${id}/history/ideation`,
          { withCredentials: true }
        );
        setMessages(res.data?.messages || []);
      } catch (err) {
        const errorMessage = err?.response?.data?.error || "Unable to load ideation history";
        toast.error(errorMessage);
        setMessages([]);
      }
    };
    loadHistory();
  }, [id]);

  const sendMessage = async (overrideText) => {
    const userMsg = (overrideText ?? input).trim();
    if (!userMsg || loading) return;

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/project/chat",
        { projectId: id, message: userMsg },
        { withCredentials: true }
      );

      setMessages(prev => [...prev, { role: "ai", content: res.data.reply }]);

      if (onIdeationStateChange) {
        onIdeationStateChange({
          ideationFinalized: res.data.ideationFinalized,
          ideaState: res.data.ideaState,
        });
      }
    } catch (err) {
      console.error("Chat Error:", err);
      toast.error(err?.response?.data?.error || "Ideation chat failed");
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className={`flex h-full flex-col ${
      isDark ? "bg-[#212121] text-[#e5e5e5]" : "bg-[#f5f5f5] text-[#111]"
    }`}>

      {/* Header */}
      <div className={`flex items-center justify-between border-b px-6 py-4 ${
        isDark ? "bg-[#2a2a2a] border-white/10" : "bg-white border-black/10"
      }`}>
        <h2 className="text-sm font-semibold">Project Chat</h2>
        <p className={`text-xs ${isDark ? "text-[#888]" : "text-[#666]"}`}>Live</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">

        {/* Starter suggestions — only when chat is empty */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <p className={`text-[11px] font-semibold tracking-widest uppercase ${
                isDark ? "text-[#555]" : "text-[#bbb]"
              }`}>
                Try a suggestion
              </p>
              <div className="flex flex-col gap-2 w-full">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.22 }}
                    onClick={() => sendMessage(s)}
                    className={`w-full text-left rounded-xl px-4 py-3 text-sm border transition-all duration-150 ${
                      isDark
                        ? "bg-[#2a2a2a] border-white/10 text-[#ccc] hover:bg-[#333] hover:border-white/25 hover:text-white"
                        : "bg-white border-black/10 text-[#333] hover:bg-[#f0f0f0] hover:border-black/20 hover:text-black"
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] rounded-xl px-5 py-4 ${
                m.role === "user"
                  ? isDark ? "bg-[#3a3a3a]" : "bg-black text-white"
                  : isDark ? "bg-[#2a2a2a] border border-white/10" : "bg-white border border-black/10"
              }`}>
                <div className={`mb-2 text-[11px] font-medium ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-xl px-5 py-4 text-sm ${
              isDark
                ? "bg-[#2a2a2a] border border-white/10 text-[#888]"
                : "bg-white border border-black/10 text-[#555]"
            }`}>
              Generating response...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`border-t px-6 py-4 ${
        isDark ? "bg-[#2a2a2a] border-white/10" : "bg-white border-black/10"
      }`}>
        <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
          isDark ? "bg-[#1f1f1f] border-white/10" : "bg-[#f0f0f0] border-black/10"
        }`}>
          <input
            className={`flex-1 bg-transparent px-2 py-2 text-sm outline-none ${
              isDark ? "placeholder:text-[#666]" : "placeholder:text-[#888]"
            }`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${
              isDark
                ? "bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                : "bg-black text-white hover:bg-[#222]"
            }`}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}