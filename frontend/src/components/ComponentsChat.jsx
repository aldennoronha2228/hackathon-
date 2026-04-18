import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "What components do I need for my project? 🔩",
  "Suggest sensors for environmental monitoring 🌡️",
  "What microcontroller should I use? 🧠",
  "Help me pick a communication module 📡",
  "What power supply options are available? 🔋",
];

export default function ComponentsChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const loadHistoryOrInit = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const historyRes = await axios.get(
          `http://localhost:5000/api/project/${id}/history/components`,
          { withCredentials: true }
        );
        const existingMessages = historyRes.data?.messages || [];
        if (existingMessages.length > 0) {
          setMessages(existingMessages);
          return;
        }
        const res = await axios.post(
          "http://localhost:5000/api/components/init",
          { projectId: id },
          { withCredentials: true }
        );
        setMessages([{ role: "ai", content: res.data.reply }]);
      } catch (err) {
        const errorMessage = err?.response?.data?.error || "Unable to start Components AI";
        toast.error(errorMessage);
        setMessages([{ role: "ai", content: errorMessage }]);
      } finally {
        setLoading(false);
      }
    };
    loadHistoryOrInit();
  }, [id]);

  const sendMessage = async (overrideText) => {
    const userMsg = (overrideText ?? input).trim();
    if (!userMsg || loading) return;

    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/components/chat",
        { projectId: id, message: userMsg },
        { withCredentials: true }
      );
      setMessages(prev => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      const errorMessage = err?.response?.data?.error || "Components chat failed";
      toast.error(errorMessage);
      setMessages(prev => [...prev, { role: "ai", content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  // Show suggestions only when messages are empty (ignores the init AI message)
  const hasOnlyInitMessage = messages.length === 1 && messages[0]?.role === "ai";
  const showSuggestions = (messages.length === 0 || hasOnlyInitMessage) && !loading;

  return (
    <div className={`flex h-full flex-col ${
      isDark ? "bg-[#212121] text-[#e5e5e5]" : "bg-[#f5f5f5] text-[#111]"
    }`}>
      <div className={`flex items-center justify-between border-b px-6 py-4 ${
        isDark ? "bg-[#2a2a2a] border-white/10" : "bg-white border-black/10"
      }`}>
        <h2 className="text-sm font-semibold">Components Chat</h2>
        <p className={`text-xs ${isDark ? "text-[#888]" : "text-[#666]"}`}>Live</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">

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
                <div className="text-sm leading-relaxed">
                  {(() => {
                    if (m.role !== "ai") return <div className="whitespace-pre-wrap">{m.content}</div>;
                    
                    const text = (m.content || "").trim();
                    if (text.startsWith("{")) {
                      const elements = [];

                      const archMatch = text.match(/"architecture"\s*:\s*"([^"]+)"/i);
                      if (archMatch) {
                        elements.push(
                          <div key="arch" className="mb-4">
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>🏗️ Architecture</h3>
                            <div className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-[#2a2a2a] border-white/5' : 'bg-gray-50 border-black/5'}`}>
                              {archMatch[1]}
                            </div>
                          </div>
                        );
                      }

                      const compSection = text.match(/"components"\s*:\s*\[([\s\S]*?)\]/i);
                      if (compSection) {
                        const partsRegex = /{[^}]*}/g;
                        const parts = compSection[1].match(partsRegex) || [];
                        if (parts.length > 0) {
                          elements.push(
                            <div key="comp" className="mb-4">
                              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>📦 Components List</h3>
                              <ul className="space-y-2">
                                {parts.map((partText, idx) => {
                                  const name = (partText.match(/"name"\s*:\s*"([^"]+)"/i) || [])[1] || "Part";
                                  const type = (partText.match(/"type"\s*:\s*"([^"]+)"/i) || [])[1] || "Component";
                                  const desc = (partText.match(/"description"\s*:\s*"([^"]+)"/i) || [])[1] || "";
                                  return (
                                    <li key={idx} className={`flex flex-col p-3 rounded-lg border border-l-4 ${isDark ? 'bg-[#2a2a2a] border-white/5 border-l-emerald-500' : 'bg-gray-50 border-black/5 border-l-emerald-500'}`}>
                                      <div className="flex items-baseline gap-2">
                                        <span className="font-semibold">{name}</span>
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-emerald-400/80' : 'text-emerald-600/80'}`}>{type}</span>
                                      </div>
                                      {desc && <span className={`text-xs mt-1 ${isDark ? 'text-[#888]' : 'text-gray-600'}`}>{desc}</span>}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        }
                      }

                      const replyMatch = text.match(/"reply"\s*:\s*"([\s\S]*?)"\s*\}/i) || text.match(/"reply"\s*:\s*"([\s\S]*)/i);
                      if (replyMatch) {
                        let replyText = replyMatch[1].replace(/\\n/g, "\n").replace(/"$/, "").trim();
                        elements.push(
                          <div key="reply" className="mb-2">
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>🛠️ Implementation</h3>
                            <div className="whitespace-pre-wrap pl-2 border-l-2 border-orange-500/30">
                              {replyText}
                            </div>
                          </div>
                        );
                      }

                      if (elements.length > 0) return <div>{elements}</div>;
                    }

                    return <div className="whitespace-pre-wrap">{m.content}</div>;
                  })()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Suggestion chips — shown after AI's init message */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              <p className={`text-[11px] font-semibold tracking-widest uppercase ${
                isDark ? "text-[#555]" : "text-[#bbb]"
              }`}>
                Quick replies
              </p>
              <div className="flex flex-col gap-2">
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
            placeholder="Ask for implementation details..."
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