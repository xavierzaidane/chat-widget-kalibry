'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, BotMessageSquare, X, Sparkles } from 'lucide-react';
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
    { role: 'bot', text: 'Hi there 👋\nHow can I assist you today?' }
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

    // simulate bot typing with smooth delay
    setBotTyping(true);
    const botReply: Message = {
      role: 'bot',
      text:
        'Thank you for your message! Our support team will get back to you shortly.\n\n' +
        'If your inquiry is urgent, please mention it and we\'ll prioritize it.'
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botReply]);
      setBotTyping(false);
    }, 800);
  };

  return (
    <div className="chat-widget-container fixed bottom-6 right-6 z-[99999]">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.06, duration: 0.5 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Floating Launcher */}
        <MorphingPopoverTrigger
          className="chat-launcher flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 text-white shadow-sm hover:scale-105 active:scale-95 transition-transform ring-1 ring-transparent hover:ring-zinc-300"
          aria-label="Open chat"
        >
          <motion.span layoutId={`label-${id}`}>
            <BotMessageSquare size={24} />
          </motion.span>
        </MorphingPopoverTrigger>

        {/* Chat Popup */}
        <MorphingPopoverContent
          className="chat-popup fixed bottom-24 right-6 w-[520px] max-w-[92vw] h-[680px] max-h-[86vh] rounded-2xl bg-zinc-50 shadow-md border border-zinc-200 flex flex-col overflow-hidden z-[999999]"
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
            <div className="chat-header px-5 py-3 flex items-center justify-between border-b border-zinc-200 bg-zinc-50">
              <div className="chat-header-brand flex items-center gap-3">
                <div className="chat-header-icon flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-100">
                  <Sparkles className="text-zinc-800" size={18} />
                </div>
                <div>
                  <div className="chat-header-title text-sm font-semibold text-zinc-900">Kalibry Chat</div>
                  <div className="chat-header-subtitle text-xs text-zinc-500">Typically replies within a few minutes</div>
                </div>
              </div>

              <div className="chat-header-actions flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                  aria-label="Minimize chat"
                  title="Minimize"
                >
                  <ArrowLeft size={18} className="text-zinc-600" />
                </button>

                <button
                  onClick={closePopup}
                  className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X size={18} className="text-zinc-600" />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="chat-messages-container flex-1 overflow-y-auto px-4 py-4 bg-transparent">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.03 }}
                  className={`chat-message-wrapper flex mb-3 ${m.role === 'user' ? 'chat-message-user justify-end' : 'chat-message-bot justify-start'}`}
                >
                  <div
                    className={`chat-message-bubble max-w-[78%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      m.role === 'user'
                        ? 'chat-message-user-bubble bg-gray-700 text-white rounded-br-none'
                        : 'chat-message-bot-bubble bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                    }`}
                    style={{ boxShadow: m.role === 'user' ? '0 8px 24px rgba(15,23,42,0.08)' : undefined }}
                  >
                    {m.text}
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
                    className="flex items-center gap-2"
                  >
                    <div className="chat-typing-avatar h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center">
                      <BotMessageSquare className="text-zinc-800" size={14} />
                    </div>
                    <div className="chat-typing-bubble bg-white border border-zinc-200 px-3 py-2 rounded-2xl text-sm">
                      <div className="chat-typing-dots flex gap-1 items-end">
                        <span className="chat-typing-dot animate-typing-dot-1 h-2 w-2 bg-zinc-600 rounded-full animate-[blink_1.4s_infinite] inline-block" />
                        <span className="chat-typing-dot animate-typing-dot-2 h-2 w-2 bg-zinc-600 rounded-full animate-[blink_1.4s_0.2s_infinite] inline-block" />
                        <span className="chat-typing-dot animate-typing-dot-3 h-2 w-2 bg-zinc-600 rounded-full animate-[blink_1.4s_0.4s_infinite] inline-block" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input area */}
            <div className="chat-input-area p-3 border-t border-zinc-200 bg-zinc-50">
              <div className="chat-input-container flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a question or describe your issue..."
                  className="chat-input-field flex-1 px-4 py-2 text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-shadow shadow-sm"
                  aria-label="Message input"
                />

                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={`chat-send-button p-2 rounded-lg flex items-center justify-center transition-all ${
                    input.trim() 
                      ? 'chat-send-button-enabled bg-zinc-900 hover:bg-zinc-800 text-white' 
                      : 'chat-send-button-disabled bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                  title="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
}
