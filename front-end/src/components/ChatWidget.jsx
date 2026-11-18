import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { sendChatMessage } from '../api';

const QUICK_PROMPTS = [
  'What rooms are available?',
  'What is the night curfew rule?',
  'What are the monthly fee rates?',
  'Can I change my room?'
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hms_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          '👋 Hello! I am your AI Assistant for the Hotel & Hostel Management System. Ask me anything about room vacancies, amenities, monthly fee rates, or hostel rules!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    let sid = localStorage.getItem('hms_chat_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('hms_chat_session_id', sid);
    }
    return sid;
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('hms_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    if (text.length > 500) {
      setErrorMessage('Message exceeds the 500 character limit.');
      return;
    }

    setErrorMessage(null);
    setInput('');

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: text,
        session_id: sessionId
      });

      const replyText =
        response.data?.reply ||
        response.data?.data?.reply ||
        'I received your message, but no answer could be retrieved. Please visit the front desk.';

      if (response.data?.session_id) {
        setSessionId(response.data.session_id);
        localStorage.setItem('hms_chat_session_id', response.data.session_id);
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg =
        err.response?.data?.reply ||
        err.response?.data?.message ||
        'Connection to AI service failed. Please check your network or try again in a moment.';
      setErrorMessage(errMsg);

      const botFallback = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '⚠️ I am temporarily unable to reach the AI server. For immediate assistance, please contact the front desk at +1 (555) 019-2834 or visit the administration office.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, botFallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const newSession = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    setSessionId(newSession);
    localStorage.setItem('hms_chat_session_id', newSession);
    const initialMsg = [
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'Conversation cleared! How can I assist you with your hotel or hostel inquiry today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initialMsg);
    localStorage.setItem('hms_chat_messages', JSON.stringify(initialMsg));
    setErrorMessage(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* ---------------- Open Chat Window ---------------- */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[410px] h-[550px] max-h-[82vh] flex flex-col rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(79,70,229,0.25)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-indigo-700 ring-2 ring-emerald-400/30 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-wide">HMS Assistant</h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white/20 rounded-md border border-white/20 text-indigo-100">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-300" />
                  Verified Hotel Data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={clearChat}
                title="Reset conversation"
                className="p-1.5 hover:bg-white/20 rounded-xl transition hover:text-white"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:bg-white/20 rounded-xl transition hover:text-white"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Quick Info Banner */}
          <div className="bg-indigo-50/70 border-b border-indigo-100/80 px-4 py-1.5 text-[11px] text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-1 text-indigo-700 font-medium truncate">
              <Sparkles size={12} className="text-indigo-500 shrink-0" />
              Direct booking changes must be confirmed at front desk.
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs mb-1">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed transition-all shadow-xs ${
                      isUser
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-xs font-medium shadow-[0_4px_12px_rgba(79,70,229,0.2)]'
                        : m.isError
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isUser ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="h-7 w-7 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mb-1">
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot size={15} />
                </div>
                <div className="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-300 animate-bounce" />
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-500" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/70 rounded-full transition shadow-2xs hover:shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={500}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about rooms, rates, or rules…"
                  disabled={isLoading}
                  className="w-full pl-3.5 pr-14 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400 transition"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium">
                  {input.length}/500
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center justify-center transition shadow-[0_4px_12px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Floating Launcher Button ---------------- */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-[0_10px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_14px_30px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open AI Hotel Assistant"
      >
        {isOpen ? (
          <X size={24} className="transition-transform group-hover:rotate-90 duration-300" />
        ) : (
          <>
            <MessageSquare size={24} className="transition-transform group-hover:scale-110 duration-200" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white items-center justify-center text-[8px] font-black">
                ✨
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
