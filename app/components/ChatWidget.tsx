'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { Send, BotMessageSquare, X, Sparkles } from 'lucide-react';
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
      text: "👋 Hi, I'm Kalibry Assistant. Ask me about setup I’ll respond clearly and fast."
    }
  ]);
  const [botTyping, setBotTyping] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setBotTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "Got it 💜 Here’s what I can suggest:\n\n1️⃣ Steps to fix or set up\n2️⃣ Helpful resources\n3️⃣ Next actions for better results"
        }
      ]);
      setBotTyping(false);
    }, 800);
  };

  return (
    <div className="chat-widget-container fixed bottom-6 right-6 z-[99999] isolate">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.05, duration: 0.45 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Launcher */}
        <MorphingPopoverTrigger
          className="chat-launcher flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-800 text-white shadow-lg hover:scale-105 active:scale-95 transition-all ring-1 ring-violet-500/30 focus:outline-none"
          aria-label="Open Kalibry Assistant"
        >
          <motion.span
            layoutId={`label-${id}`}
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BotMessageSquare size={30} className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
          </motion.span>
        </MorphingPopoverTrigger>

        {/* Popup */}
        <MorphingPopoverContent
          className="chat-popup fixed bottom-24 right-6 w-[440px] max-w-[94vw] h-[640px] max-h-[90vh] rounded-3xl bg-[#1f1f1f] text-slate-100 shadow-2xl border border-neutral-700/40 flex flex-col overflow-hidden z-[999999]"
          aria-label="Chat support window"
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="chat-header px-5 py-4 flex items-center justify-between bg-gradient-to-r from-[#2a2a2a] to-[#1f1f1f] border-b border-neutral-700/50">
              <div className="flex items-center gap-3">
                <Sparkles className="text-violet-400" size={18} />
                <div>
                  <div className="font-semibold text-slate-100 text-sm">Kalibry Assistant</div>
                  <div className="text-xs text-slate-400">Replies instantly</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-neutral-800 transition-colors"
                aria-label="Close chat"
              >
                <X size={16} className="text-slate-300" />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages-container flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#1f1f1f]">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'bot' && (
                    <div className="mr-3 flex-shrink-0">
                      <div className="h-8 w-8 rounded-md bg-neutral-800 flex items-center justify-center">
                        <BotMessageSquare className="text-violet-400" size={15} />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl leading-relaxed text-sm ${
                      m.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-2xl rounded-tl-2xl'
                        : 'bg-[#2a2a2a] text-slate-100 border border-neutral-700/50 rounded-tr-2xl rounded-bl-2xl'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {botTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-1">
                  <div className="h-2 w-2 bg-violet-400 rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-violet-500 rounded-full animate-pulse delay-150" />
                  <div className="h-2 w-2 bg-violet-600 rounded-full animate-pulse delay-300" />
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area px-5 py-4 bg-[#1a1a1a] border-t border-neutral-700/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Kalibry..."
                  className="flex-1 bg-[#2a2a2a] text-slate-100 placeholder:text-slate-400 px-4 py-3 rounded-full border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${
                    input.trim()
                      ? 'bg-violet-600 hover:bg-violet-500 text-white'
                      : 'bg-neutral-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={17} />
                </button>
              </form>
            </div>
          </motion.div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
}
