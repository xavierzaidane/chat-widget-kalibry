'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, BotMessageSquare, X, Sparkles } from 'lucide-react';
import { MorphingPopover, MorphingPopoverContent, MorphingPopoverTrigger } from './ui/morphing-popover';

interface Message {
  role: 'user' | 'bot';
  text: string;
  meta?: string;
}

export function ChatWidget() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text:
        "Hello 👋 I'm Kalibry Assistant. I can help with product information, troubleshooting, or store setup. " +
        "Tell me briefly what you need and I'll provide a clear, actionable response."
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
      // focus input after opening for quicker UX
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  const closePopup = () => setOpen(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // simulate bot typing with thoughtful delay
    setBotTyping(true);

    const botReply: Message = {
      role: 'bot',
      text:
        "Thanks — I’ve received your question. Here’s a concise, professional response:\n\n" +
        "• Summary: I'll address the key points first.\n" +
        "• Steps: If applicable, I’ll provide step-by-step instructions.\n" +
        "• Next actions: Suggestions & follow-ups.\n\n" +
        "If you share the exact details (URLs, error messages, or screenshots), I can provide a more precise solution."
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
      setBotTyping(false);
    }, 900);
  };

  return (
    <div className="chat-widget-container fixed bottom-6 right-6 z-[99999]">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.06, duration: 0.5 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Floating Launcher - neutral GPT-like style */}
                <MorphingPopoverTrigger
          className="chat-launcher flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg hover:scale-105 active:scale-97 transition-transform ring-1 ring-slate-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/30"
          aria-label="Open chat"
          title="Open Kalibry Assistant"
        >
          <motion.span
            layoutId={`label-${id}`}
            className="flex items-center justify-center"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <div>
              <BotMessageSquare size={30} className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
            </div>
            <span className="sr-only">Open Kalibry Assistant</span>
          </motion.span>
        </MorphingPopoverTrigger>

        {/* Chat Popup */}
        <MorphingPopoverContent
          className="chat-popup fixed bottom-24 right-6 w-[560px] max-w-[92vw] h-[720px] max-h-[86vh] rounded-2xl bg-white shadow-sm border border-zinc-200 flex flex-col overflow-hidden z-[999999] text-sm font-sans"
          aria-label="Customer support chat"
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="chat-header px-5 py-3 flex items-center justify-between border-b border-zinc-100 bg-white rounded-t-2xl">
              <div className="chat-header-brand flex items-center gap-3">
                <div className="chat-header-icon flex items-center justify-center h-9 w-9">
                  <Sparkles className="text-gray-700" size={18} />
                </div>
                <div>
                  <div className="chat-header-title text-sm font-semibold text-slate-900">Kalibry Assistant</div>
                  <div className="chat-header-subtitle text-xs text-slate-500">Typically replies within a few minutes</div>
                </div>
              </div>

              <div className="chat-header-actions flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-zinc-50 transition-colors"
                  aria-label="Minimize chat"
                  title="Minimize"
                >
                </button>

                <button
                  onClick={closePopup}
                  className="p-2 rounded-md hover:bg-zinc-50 transition-colors"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="chat-messages-container flex-1 overflow-y-auto px-5 py-5 bg-transparent">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.02 }}
                  className={`chat-message-wrapper flex mb-4 ${m.role === 'user' ? 'chat-message-user justify-end' : 'chat-message-bot justify-start'}`}
                >
                  {m.role === 'bot' && (
                    <div className="chat-avatar mr-3 flex-shrink-0 flex items-start">
                      <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center">
                        <BotMessageSquare className="text-slate-700" size={16} />
                      </div>
                    </div>
                  )}

                  <div
                    className={`chat-message-bubble max-w-[78%] px-4 py-3 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-gray-700 text-white rounded-br-2xl rounded-tl-2xl rounded-tr-md rounded-bl-2xl'
                        : 'bg-slate-50 border border-zinc-100 text-slate-900 rounded-bl-2xl rounded-tr-2xl rounded-tl-md rounded-br-2xl'
                    }`}
                    style={{ boxShadow: m.role === 'user' ? '0 10px 30px rgba(15,23,42,0.12)' : undefined }}
                  >
                    {/* Optional role label for bot messages */}
                    {m.role === 'bot' && (
                      <div className="text-xs font-medium text-slate-500 mb-1">Assistant</div>
                    )}

                    <div className="whitespace-pre-line leading-6">
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* typing indicator */}
              {botTyping && (
                <div className="chat-typing-indicator flex mb-3 justify-start">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <div className="chat-typing-avatar h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center">
                      <BotMessageSquare className="text-slate-700" size={14} />
                    </div>
                    <div className="chat-typing-bubble bg-slate-50 border border-zinc-100 px-3 py-2 rounded-2xl text-sm">
                      <div className="chat-typing-dots flex gap-1 items-end">
                        <span className="h-2 w-2 bg-slate-600 rounded-full animate-[blink_1.2s_infinite]" style={{ animationDelay: '0s' }} />
                        <span className="h-2 w-2 bg-slate-600 rounded-full animate-[blink_1.2s_infinite]" style={{ animationDelay: '0.15s' }} />
                        <span className="h-2 w-2 bg-slate-600 rounded-full animate-[blink_1.2s_infinite]" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input area */}
            <div className="chat-input-area px-4 pb-5 pt-5 bg-white">
              <div className="max-w-3xl mx-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="relative flex items-center"
                  aria-label="Chat input form"
                >
                  {/* Main input container */}
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message Kalibry"
                      className="h-12 w-130 pr-12 pl-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 bg-slate-100 border border-zinc-200 rounded-4xl outline-none transition-all focus:border-zinc-400 focus:shadow-md"
                      aria-label="Message input"
                    />
                    
                    {/* Send button positioned inside the input */}
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${
                          input.trim()
                            ? 'bg-black hover:bg-gray-800 text-white shadow-sm'
                            : 'bg-gray-600 text-gray-200 cursor-not-allowed'
                        }`}
                        aria-label="Send message"
                        title="Send"
                      >
                        <Send size={19} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
}



