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

  const S = {
    container: {
      position: 'fixed' as const,
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 99999,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      lineHeight: 1.5,
      color: '#171717',
      boxSizing: 'border-box' as const,
    },
    launcher: {
      display: 'flex',
      height: '4rem',
      width: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      color: '#fff',
      backgroundColor: '#6C47FF',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(108,71,255,0.35)',
      transition: 'transform 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease',
      outline: 'none',
    },
    popup: {
      position: 'fixed' as const,
      bottom: '6rem',
      right: '1.5rem',
      width: '415px',
      maxWidth: '92vw',
      height: '620px',
      maxHeight: '86vh',
      borderRadius: '0.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 3px rgba(0,0,0,0.15)',
      border: '1px solid #dedddd',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      zIndex: 999999,
      boxSizing: 'border-box' as const,
    },
    header: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#EFE6FF',
      padding: '1rem 1.5rem',
      boxSizing: 'border-box' as const,
      borderRadius: '0.5rem 0.5rem 0 0',
    },
    headerBrand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    headerIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '3rem',
      width: '3rem',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    headerIconImg: { width: '2.5rem', height: '2.5rem', display: 'block', objectFit: 'contain' as const },
    headerText: { display: 'flex', flexDirection: 'column' as const, marginLeft: '0.75rem' },
    headerTitle: { fontSize: '1.0625rem', fontWeight: 600, color: '#4E32B5', lineHeight: 1.2 },
    headerSubtitle: { fontSize: '0.875rem', color: '#4E32B5', opacity: 0.6, fontWeight: 600, marginTop: '0.25rem' },
    onlineRow: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
    onlineDot: { display: 'inline-block', width: '0.5rem', height: '0.5rem', backgroundColor: '#10b981', borderRadius: '9999px', animation: 'kalibry-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' },
    headerActions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    headerButton: { padding: '0.5rem', borderRadius: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', color: '#A48BFF' },
    messagesContainer: { flex: 1, overflowY: 'auto' as const, padding: '1.5rem 1.25rem', backgroundColor: '#ffffff', boxSizing: 'border-box' as const },
    messageWrapperBase: { display: 'flex', marginBottom: '1.25rem', boxSizing: 'border-box' as const },
    messageBubble: { maxWidth: '75%', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', lineHeight: 1.35, whiteSpace: 'pre-line' as const, wordWrap: 'break-word' as const, boxSizing: 'border-box' as const },
    userBubble: { backgroundColor: '#6C47FF', color: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    botBubble: { backgroundColor: '#F1F1F1', color: '#171717' },
    typingIndicator: { display: 'flex', marginTop: '1.25rem', justifyContent: 'flex-start' },
    typingBubble: { backgroundColor: '#F4F4F7', borderRadius: '1rem', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', maxWidth: '60%' },
    typingDot: { width: '0.5rem', height: '0.5rem', borderRadius: '9999px', display: 'inline-block' },
    inputArea: { flex: '0 0 auto', padding: '1.5rem', backgroundColor: '#ffffff', boxSizing: 'border-box' as const },
    inputContainer: { display: 'flex', height: '3rem', padding: '0 1rem', borderRadius: '0.75rem', outline: '2px solid #e2e8f0', outlineOffset: '-2px', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff', boxSizing: 'border-box' as const },
    inputField: { flex: 1, background: 'transparent', color: '#000', fontSize: '0.875rem', border: 'none', outline: 'none', fontFamily: 'inherit', width: '100%', padding: 0 },
    sendButton: { width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, flexShrink: 0, color: '#6C47FF' },
    placeholderLine: { background: '#e9e9ef', borderRadius: '6px', height: '0.875rem', display: 'block' },
  };

  return (
    <div style={S.container} id="kalibry-chat-widget-root">
      <MorphingPopover
        transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Launcher */}
        <MorphingPopoverTrigger
          style={S.launcher}
          aria-label="Open Kalibry Assistant"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
            <MessageCircleMore size={30} style={{ color: '#fff', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }} />
          </span>
        </MorphingPopoverTrigger>

        {/* Popup */}
        <MorphingPopoverContent
          style={S.popup}
          aria-label="Chat support window"
        >
          {/* HEADER */}
          <div style={S.header}>
            <div style={S.headerBrand as React.CSSProperties}>
              <div style={S.headerIcon}>
                <img src="https://chat-widget-kalibry.vercel.app/Icon.svg" alt="Assistant" style={S.headerIconImg} />
              </div>

              <div style={S.headerText}>
                <span style={S.headerTitle}>Virtual Assistant</span>

                <div style={S.headerSubtitle}>
                  <div style={S.onlineRow}>
                    <span style={S.onlineDot as React.CSSProperties} />
                    <span style={{ fontSize: '0.875rem', color: '#4E32B5', fontWeight: 600 }}>Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={S.headerActions}>
              <button
                onClick={() => setOpen(false)}
                style={S.headerButton}
                aria-label="Close chat"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={S.messagesContainer}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.25rem 0' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
                  <div>
                    <span style={{ ...S.placeholderLine, width: '8rem', marginBottom: '0.5rem', display: 'block' }} />
                    <span style={{ ...S.placeholderLine, width: '14rem', display: 'block' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <div>
                    <span style={{ ...S.placeholderLine, width: '12rem', display: 'block' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start' }}>
                  <div>
                    <span style={{ ...S.placeholderLine, width: '14rem', marginBottom: '0.5rem', display: 'block' }} />
                    <span style={{ ...S.placeholderLine, width: '8rem', display: 'block' }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '0.25rem' }}>
                  {messages.map((m, i) => {
                    const wrapperStyle = {
                      ...S.messageWrapperBase,
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                    } as React.CSSProperties;
                    const bubbleStyle = {
                      ...S.messageBubble,
                      ...(m.role === 'user' ? S.userBubble : S.botBubble),
                    } as React.CSSProperties;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: i * 0.03 }}
                        style={wrapperStyle}
                      >
                        <div style={bubbleStyle}>
                          {m.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {botTyping && (
                  <div style={S.typingIndicator}>
                    <div style={S.typingBubble}>
                      <span style={{ ...S.typingDot, backgroundColor: '#A48CFF', animation: 'kalibry-bounce 1s infinite -0.3s' }} />
                      <span style={{ ...S.typingDot, backgroundColor: '#8C6BFF', animation: 'kalibry-bounce 1s infinite -0.15s' }} />
                      <span style={{ ...S.typingDot, backgroundColor: '#6B4EFF', animation: 'kalibry-bounce 1s infinite' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={endRef} />
          </div>

          {/* INPUT */}
          <div style={S.inputArea}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              style={S.inputContainer}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                style={S.inputField}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                style={{ ...S.sendButton, opacity: input.trim() ? 1 : 0.5, cursor: input.trim() ? 'pointer' : 'not-allowed' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#6c47ff" aria-hidden="true">
                  <g clipPath="url(#clip0_4418_8610)">
                    <path d="M16.1401 2.95907L7.11012 5.95907C1.04012 7.98907 1.04012 11.2991 7.11012 13.3191L9.79012 14.2091L10.6801 16.8891C12.7001 22.9591 16.0201 22.9591 18.0401 16.8891L21.0501 7.86907C22.3901 3.81907 20.1901 1.60907 16.1401 2.95907ZM16.4601 8.33907L12.6601 12.1591C12.5101 12.3091 12.3201 12.3791 12.1301 12.3791C11.9401 12.3791 11.7501 12.3091 11.6001 12.1591C11.3101 11.8691 11.3101 11.3891 11.6001 11.0991L15.4001 7.27907C15.6901 6.98907 16.1701 6.98907 16.4601 7.27907C16.7501 7.56907 16.7501 8.04907 16.4601 8.33907Z" fill="currentColor" />
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

      {/* keyframes added inline using a style tag to support animations */}
      <style>{`
        @keyframes kalibry-bounce {
          0%,100% { transform: translateY(0); opacity:1; }
          50% { transform: translateY(-0.5rem); opacity:0.7; }
        }
        @keyframes kalibry-pulse {
          0%,100% { opacity:1; }
          50% { opacity:0.5; }
        }
      `}</style>
    </div>
  );
}