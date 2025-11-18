'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { Send, BotMessageSquare, X, MessageCircleIcon, MessageCircleMore } from 'lucide-react';
import { MorphingPopover, MorphingPopoverContent, MorphingPopoverTrigger } from './ui/morphing-popover';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export function ChatWidget() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi there, I'm Kalibry Assistant. I'll respond clearly and fast."
    }
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const focusT = setTimeout(() => inputRef.current?.focus(), 180);
      const loadT = setTimeout(() => setLoading(false), 600); 
      return () => {
        clearTimeout(focusT);
        clearTimeout(loadT);
      };
    } else {
      setLoading(false);
    }
  }, [open]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const streamBotReply = async (fullText: string) => {
    setBotTyping(true);
    setMessages((prev) => [...prev, { role: 'bot', text: '' }]);
    await sleep(300);

    for (const ch of fullText) {
      await sleep(ch === '\n' ? 120 : 18);
      setMessages((prev) => {
        const msgs = [...prev];
        const last = msgs.length - 1;
        if (last >= 0 && msgs[last].role === 'bot') {
          msgs[last] = { ...msgs[last], text: msgs[last].text + ch };
        }
        return msgs;
      });
    }
    setBotTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botText =
      "I'm here to help you with any questions or information you need. How can I assist you today?";

    await streamBotReply(botText);
  };

  return (
    <div className="chat-widget-container fixed bottom-6 right-6 z-[99999] isolate">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.35, duration: 0.50 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Launcher */}
        <MorphingPopoverTrigger
          className="chat-launcher flex h-16 w-16 items-center justify-center rounded-full bg-[#6C47FF] text-white shadow-lg hover:bg-[#5C3DF0] hover:scale-105 active:scale-95 transition-all ring-1 ring-[rgba(108,71,255,0.35)] focus:outline-none"
          aria-label="Open Kalibry Assistant"
        >
          <motion.span
            layoutId={`label-${id}`}
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircleMore size={30} className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
          </motion.span>
        </MorphingPopoverTrigger>

        {/* Popup */}
        <MorphingPopoverContent
            className="fixed bottom-24 right-6 w-[415px] h-[620px] 
              bg-white rounded-lg shadow-b-sm-[0_2px_8px_rgba(0,0,0,0.15)]
              overflow-hidden flex flex-col border border-[#dedddd]"
            aria-label="Chat support window"
          >
          {/* ================= HEADER ================= */}
          <div className="flex-none flex items-stretch w-full justify-between bg-[#EFE6FF] rounded-t-md px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-1xl bg-inherit flex items-center justify-center ">
                <img
                  src="/Icon.svg"
                  alt="Assistant"
                  className="w-10 h-10"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#4E32B5] font-semibold text-[17px] leading-tight">
                  Virtual Assistant
                </span>
                <div className="flex items-center gap-2 mt-1">
                    <img src="/ellipse.svg" alt="Online status" className="w-2 h-2" />
                    <span className="opacity-60 text-sm text-[#4E32B5] font-semibold">Online</span>
                  </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={22} className="text-[#A48BFF] hover:bg-black/5 transition-colors duration-200 rounded-2xl" />
            </button>
          </div>

          {/* ================= CHAT MESSAGES ================= */}
          <div className="flex-1 overflow-y-auto px-5 py-6 bg-white">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="h-4 w-40 bg-slate-200 rounded-md mb-2" />
                    <div className="h-4 w-64 bg-slate-200 rounded-md" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="h-4 w-48 bg-slate-200/80 rounded-md mb-2" />
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="h-4 w-56 bg-slate-200 rounded-md mb-2" />
                    <div className="h-4 w-28 bg-slate-200 rounded-md" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg text-md leading-[1.35] ${
                          m.role === 'user'
                            ? 'bg-[#6B4EFF] text-white shadow-sm'
                            : 'bg-[#F4F4F7] text-[#171717]'
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Typing Indicator (chat-bubble style) */}
                {botTyping && (
                  <div className="flex justify-start mt-5">
                    <div className="max-w-[60%] bg-[#F4F4F7] rounded-2xl px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-[#A48CFF] rounded-full animate-bounce [animation-duration:1s] [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-[#8C6BFF] rounded-full animate-bounce [animation-duration:1s] [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-[#6B4EFF] rounded-full animate-bounce [animation-duration:1s]" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={endRef} />
          </div>

          {/* ================= INPUT BOX ================= */}
          <div className="flex-none p-6 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex h-12 px-4 rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 items-center gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1 bg-transparent text-black text-sm placeholder:opacity-40 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-6 h-6 relative flex items-center justify-center disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="#6c47ff"
                  className={`w-6 h-6 ${!input.trim() ? 'opacity-40' : ''}`}
                  aria-hidden="true"
                >
                  <g clipPath="url(#clip0_4418_8610)">
                    <path
                      d="M16.1401 2.95907L7.11012 5.95907C1.04012 7.98907 1.04012 11.2991 7.11012 13.3191L9.79012 14.2091L10.6801 16.8891C12.7001 22.9591 16.0201 22.9591 18.0401 16.8891L21.0501 7.86907C22.3901 3.81907 20.1901 1.60907 16.1401 2.95907ZM16.4601 8.33907L12.6601 12.1591C12.5101 12.3091 12.3201 12.3791 12.1301 12.3791C11.9401 12.3791 11.7501 12.3091 11.6001 12.1591C11.3101 11.8691 11.3101 11.3891 11.6001 11.0991L15.4001 7.27907C15.6901 6.98907 16.1701 6.98907 16.4601 7.27907C16.7501 7.56907 16.7501 8.04907 16.4601 8.33907Z"
                      fill="white"
                      style={{ fill: 'var(--fillg)' }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_8610">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </form>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
}