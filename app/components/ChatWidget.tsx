'use client';

import { motion } from 'motion/react';
import { useId, useState, useRef, useEffect } from 'react';
import { MorphingPopover, MorphingPopoverContent, MorphingPopoverTrigger } from './ui/morphing-popover';
import { callChatAPI } from './api/route';
import ReactMarkdown from 'react-markdown';

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
      text: `Hi! I'm Kalibry, the Purple Box AI Support Chatbot 👋

Ask me anything the more descriptive, the better I can help!`
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

    try {
      setBotTyping(true);
      const reply = await callChatAPI([...messages, userMessage]);
      
      const botText = typeof reply === 'string' ? reply : JSON.stringify(reply);
      await streamBotReply(botText);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: 'Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setBotTyping(false);
    }
  };


  return (
    <div className="kalibry-chat-widget-container">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.35, duration: 0.50 }}
        open={open}
        onOpenChange={(newOpen) => {
          if (newOpen === false && open === true) {
            return;
          }
          setOpen(newOpen);
        }}
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
            <img src="https://chat-widget-kalibry.vercel.app/message.svg"
            alt="Message"
            style={{ width: '5rem', height: '5rem' }}
            />
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
                <img src="https://chat-widget-kalibry.vercel.app/Icon.svg" alt="Assistant" />
              </div>
              <div className="flex flex-col">
                <span className="kalibry-chat-header-title">
                  Virtual Assistant
                </span>
                <div className="kalibry-chat-header-subtitle">
                <div className="flex items-center gap-2">
                  <span className="kalibry-online-indicator" />
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
                <img src="https://chat-widget-kalibry.vercel.app/X.svg" alt="Assistant" />
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
                        <ReactMarkdown>{m.text}</ReactMarkdown>
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
                disabled={botTyping}
              />

              <button
                type="submit"
                disabled={!input.trim() || botTyping}
                aria-label="Send message"
                className="kalibry-chat-send-button"
              >
                <img src="https://chat-widget-kalibry.vercel.app/send.svg" alt="Assistant" />
              </button>
            </form>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
}