import React, { useState } from 'react';
import { X, Sparkles, Send, BookOpen, ExternalLink, Bot, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course, KnowledgeArticle } from '../types';
import { Link } from 'react-router-dom';

interface CapacityBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  courses?: Course[];
  articles?: KnowledgeArticle[];
}

export const CapacityBotModal: React.FC<CapacityBotModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${user?.name || 'there'}! I am **CapacityBot**, your intelligent Digital Capacity Building and Competency Assistant for SIH26075.\n\nAsk me about national directives (like CERT-In mandatory reporting), Digital Public Infrastructure (DPI / India Stack), or how to close your current competency gaps!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = api.askCapacityBot(text, user);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courses: response.recommendedCourses,
        articles: response.relatedArticles,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const samplePrompts = [
    'What are the mandatory CERT-In incident reporting rules?',
    'What courses help bridge my department skill gaps?',
    'How do I earn and verify digital certificates?',
    'Explain the 3 pillars of India Stack and DPI',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex h-[620px] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-navy-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-gradient-to-r from-brand-900 to-navy-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">CapacityBot AI Assistant</h3>
                <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-300 border border-teal-500/30">
                  Deterministic Demo Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Curated guidance for SIH26075 & Competency Frameworks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informative Disclaimer Banner */}
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 text-[11px] text-amber-700 dark:text-amber-300 border-b border-amber-500/20">
          <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Local deterministic assistant active. Recommendations cite platform courses & guidelines.</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Recommended courses cards */}
                {m.courses && m.courses.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Recommended Learning Units:
                    </p>
                    {m.courses.map((c) => (
                      <Link
                        key={c.id}
                        to={`/courses/${c.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-lg bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-50 dark:bg-navy-950 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold truncate">{c.title}</p>
                          <p className="text-[10px] text-slate-500">{c.code} • {c.level}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Related SOP articles */}
                {m.articles && m.articles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Related SOP Guides:</p>
                    {m.articles.map((a) => (
                      <Link
                        key={a.id}
                        to="/knowledge"
                        onClick={onClose}
                        className="block text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        • {a.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <span className="mt-1 text-[10px] text-slate-400 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
              <Sparkles className="h-3 w-3 animate-spin text-teal-500" />
              CapacityBot is formulating recommendations...
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-navy-950/60">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            Suggested Prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-navy-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about courses, competencies, compliance SOPs..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="rounded-xl bg-brand-600 p-2.5 text-white hover:bg-brand-700 disabled:opacity-50 transition shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
