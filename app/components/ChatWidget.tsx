'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { X, MessageCircleMore } from 'lucide-react';
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
    <div className="kalibry-chat-widget-container">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.35, duration: 0.50 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Launcher */}
        <MorphingPopoverTrigger
          className="kalibry-chat-launcher"
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
          className="kalibry-chat-popup"
          aria-label="Chat support window"
        >
          {/* ================= HEADER ================= */}
          <div className="kalibry-chat-header">
            <div className="kalibry-chat-header-brand">
              <div className="kalibry-chat-header-icon">
                <img
                  src="/Icon.svg"
                  alt="Assistant"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col">
                <span className="kalibry-chat-header-title">
                  Virtual Assistant
                </span>
                <div className="kalibry-chat-header-subtitle">
                  <div className="flex items-center gap-2">
                    <img src="/ellipse.svg" alt="Online status" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="kalibry-chat-header-actions">
              <button
                onClick={() => setOpen(false)}
                className="kalibry-chat-header-button"
                aria-label="Close chat"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* ================= CHAT MESSAGES ================= */}
          <div className="kalibry-chat-messages-container">
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
                      className={`kalibry-chat-message-wrapper ${m.role === 'user' ? 'kalibry-chat-message-user' : 'kalibry-chat-message-bot'}`}
                    >
                      <div
                        className={`kalibry-chat-message-bubble ${
                          m.role === 'user'
                            ? 'kalibry-chat-message-user-bubble'
                            : 'kalibry-chat-message-bot-bubble'
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Typing Indicator */}
                {botTyping && (
                  <div className="kalibry-chat-typing-indicator">
                    <div className="kalibry-chat-typing-bubble">
                      <span className="kalibry-chat-typing-dot kalibry-chat-typing-dot-1" />
                      <span className="kalibry-chat-typing-dot kalibry-chat-typing-dot-2" />
                      <span className="kalibry-chat-typing-dot kalibry-chat-typing-dot-3" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={endRef} />
          </div>

          {/* ================= INPUT BOX ================= */}
          <div className="kalibry-chat-input-area">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="kalibry-chat-input-container"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="kalibry-chat-input-field"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="kalibry-chat-send-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="#6c47ff"
                  aria-hidden="true"
                >
                  <g clipPath="url(#clip0_4418_8610)">
                    <path
                      d="M16.1401 2.95907L7.11012 5.95907C1.04012 7.98907 1.04012 11.2991 7.11012 13.3191L9.79012 14.2091L10.6801 16.8891C12.7001 22.9591 16.0201 22.9591 18.0401 16.8891L21.0501 7.86907C22.3901 3.81907 20.1901 1.60907 16.1401 2.95907ZM16.4601 8.33907L12.6601 12.1591C12.5101 12.3091 12.3201 12.3791 12.1301 12.3791C11.9401 12.3791 11.7501 12.3091 11.6001 12.1591C11.3101 11.8691 11.3101 11.3891 11.6001 11.0991L15.4001 7.27907C15.6901 6.98907 16.1701 6.98907 16.4601 7.27907C16.7501 7.56907 16.7501 8.04907 16.4601 8.33907Z"
                      fill="currentColor"
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