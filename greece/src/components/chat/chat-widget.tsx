import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Eye } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLang } from "@/contexts/lang-context";

interface Message {
  id: number;
  from: "agent" | "user";
  text: string;
  time: string;
}

const QUICK_REPLIES_EN = [
  "Track my order",
  "Help with sizing",
  "Returns & exchanges",
  "Contact support",
];

const QUICK_REPLIES_AR = [
  "تتبع طلبي",
  "مساعدة في المقاسات",
  "الإرجاع والاستبدال",
  "التواصل مع الدعم",
];

const AUTO_REPLIES_EN = [
  "Sure! Share your order number and I'll look it up right away. 𓋹",
  "You can find our size guide at greece-hieroglyphs.com/size-guide — we cover XS to 3XL! 👑",
  "We accept returns within 14 days. Just reply with your order number to start.",
  "Our team is available 9am–6pm (EGT). You can also email us at support@greece.eg",
];

const AUTO_REPLIES_AR = [
  "بالتأكيد! شاركنا رقم طلبك وسنتحقق منه فوراً. 𓋹",
  "يمكنك الاطلاع على دليل المقاسات على greece-hieroglyphs.com/size-guide — من XS إلى 3XL 👑",
  "نقبل الإرجاع خلال 14 يوماً. أرسل لنا رقم طلبك للبدء.",
  "فريقنا متاح من 9ص إلى 6م (توقيت القاهرة). يمكنك أيضاً مراسلتنا على support@greece.eg",
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quickDismissed, setQuickDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const greetEN = "Welcome, modern pharaoh! 𓋹 How can we help you today?";
  const greetAR = "أهلاً أيها الفرعون الحديث! 𓋹 كيف يمكننا مساعدتك اليوم؟";

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "agent", text: lang === "ar" ? greetAR : greetEN, time: now() },
  ]);

    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset the conversation and cancel any in-flight auto-reply when the
  // language changes — otherwise a stale English reply lands in the fresh
  // Arabic conversation.
  useEffect(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setTyping(false);
    setMessages([
      { id: 1, from: "agent", text: lang === "ar" ? greetAR : greetEN, time: now() },
    ]);
    setQuickDismissed(false);
  }, [lang]);

  // Never let the auto-reply fire after the widget has unmounted.
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const isDark = theme === "dark";
  const panelBg = isDark ? "#1E1B17" : "#FDF8EF";
  const textColor = isDark ? "#FDF8EF" : "#1B1B1B";

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: text.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setQuickDismissed(true);

    setTyping(true);
    // Track the handle so switching language or unmounting cancels it — the
    // previous bare setTimeout appended the reply to whatever conversation was
    // open whenever it fired.
    typingTimerRef.current = setTimeout(() => {
      typingTimerRef.current = null;
      const replyPool = lang === "ar" ? AUTO_REPLIES_AR : AUTO_REPLIES_EN;
      const reply = replyPool[Math.floor(Math.random() * replyPool.length)];
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "agent", text: reply, time: now() },
      ]);
    }, 1400);
  };

  const quickReplies = lang === "ar" ? QUICK_REPLIES_AR : QUICK_REPLIES_EN;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-80 rounded-2xl overflow-hidden shadow-2xl border"
            style={{
              background: panelBg,
              borderColor: isDark ? "rgba(253,248,239,0.08)" : "rgba(27,27,27,0.10)",
              color: textColor,
            }}
          >
            {/* Header */}
            <div className="bg-[#1B1B1B] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C89D29]/20 flex items-center justify-center shrink-0">
                  <Eye className="h-4 w-4 text-[#C89D29]" />
                </div>
                <div>
                  <p className="font-black hieroglyph-font text-[11px] tracking-wider text-[#FDF8EF]">
                    GREECE SUPPORT
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-[#FDF8EF]/55">
                      {lang === "ar" ? "متاح الآن" : "Online now"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-[#FDF8EF]/50 hover:text-[#FDF8EF] hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="px-3 py-3 space-y-3 overflow-y-auto"
              style={{ height: 300, background: isDark ? "#171310" : "#F5EFE2" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "agent" && (
                    <div className="w-6 h-6 rounded-full bg-[#C89D29]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Eye className="h-3 w-3 text-[#C89D29]" />
                    </div>
                  )}
                  <div className={`max-w-[75%]`}>
                    <div
                      className="px-3 py-2 rounded-2xl text-[12px] leading-relaxed"
                      style={
                        msg.from === "user"
                          ? { background: "#C89D29", color: "#1B1B1B", borderBottomRightRadius: 4 }
                          : { background: panelBg, color: textColor, borderBottomLeftRadius: 4, border: `1px solid ${isDark ? "rgba(253,248,239,0.08)" : "rgba(27,27,27,0.08)"}` }
                      }
                    >
                      {msg.text}
                    </div>
                    <p
                      className="text-[10px] mt-0.5 px-1"
                      style={{ color: isDark ? "rgba(253,248,239,0.3)" : "rgba(27,27,27,0.35)", textAlign: msg.from === "user" ? "right" : "left" }}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2 items-end">
                  <div className="w-6 h-6 rounded-full bg-[#C89D29]/20 flex items-center justify-center shrink-0">
                    <Eye className="h-3 w-3 text-[#C89D29]" />
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-2xl"
                    style={{ background: panelBg, border: `1px solid ${isDark ? "rgba(253,248,239,0.08)" : "rgba(27,27,27,0.08)"}`, borderBottomLeftRadius: 4 }}
                  >
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#C89D29]"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {!quickDismissed && (
              <div
                className="px-3 py-2 flex flex-wrap gap-1.5 border-t"
                style={{ borderColor: isDark ? "rgba(253,248,239,0.06)" : "rgba(27,27,27,0.06)", background: panelBg }}
              >
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => sendMessage(qr)}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all hover:bg-[#C89D29] hover:text-[#1B1B1B] hover:border-[#C89D29]"
                    style={{
                      borderColor: isDark ? "rgba(253,248,239,0.15)" : "rgba(27,27,27,0.15)",
                      color: isDark ? "rgba(253,248,239,0.7)" : "rgba(27,27,27,0.65)",
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="px-3 py-3 border-t flex items-center gap-2"
              style={{ borderColor: isDark ? "rgba(253,248,239,0.08)" : "rgba(27,27,27,0.08)", background: panelBg }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type a message..."}
                className="flex-1 text-[12px] bg-transparent outline-none"
                style={{ color: textColor }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-[#C89D29] flex items-center justify-center transition-all hover:bg-[#1B1B1B] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-3.5 w-3.5 text-[#1B1B1B] hover:text-[#FDF8EF]" style={{ color: "#1B1B1B" }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="w-14 h-14 rounded-full bg-[#1B1B1B] shadow-xl flex items-center justify-center relative"
        style={{ boxShadow: "0 4px 20px rgba(200,157,41,0.35), 0 2px 8px rgba(0,0,0,0.25)" }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-5 w-5 text-[#FDF8EF]" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-5 w-5 text-[#C89D29]" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {!open && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#C89D29] border-2 border-[#1B1B1B] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
