import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_GREETING = {
  id: 'welcome',
  sender: 'bot',
  text: 'Hi! Welcome to PropertyReply.\nWe help UK estate agents capture leads and respond to enquiries 24/7 with AI.',
};

const FullscreenChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatBotMessage = (text) => {
    if (!text) return null;
    let cleanedText = text
      .replace(/#{2,}\s+/g, '\n## ')
      .replace(/\s+#{2,}/g, '')
      .replace(/\s+#{2,}\s+/g, '\n## ')
      .replace(/(\d+)\s*\.\s*/g, '\n$1. ')
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
    const elements = [];
    let currentList = [];
    let key = 0;
    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="list-disc list-inside space-y-1.5 my-2 ml-2 sm:ml-3">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-sm sm:text-base leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.match(/^#+\s*/)) {
        flushList();
        const headingText = trimmed.replace(/^#+\s*/g, '').replace(/#+\s*$/g, '').trim();
        if (headingText) {
          elements.push(
            <h3 key={`heading-${key++}`} className="font-bold text-base sm:text-lg mt-4 mb-2.5 first:mt-0 text-white">
              {headingText}
            </h3>
          );
        }
      } else if (trimmed.match(/^\d+\.\s*/)) {
        currentList.push(trimmed.replace(/^\d+\.\s*/, '').trim());
      } else if (trimmed.match(/^[•\-*]\s*/)) {
        currentList.push(trimmed.replace(/^[•\-*]\s*/, '').trim());
      } else if (trimmed) {
        flushList();
        elements.push(
          <p key={`para-${key++}`} className="mb-2 text-sm sm:text-base leading-relaxed">
            {trimmed}
          </p>
        );
      }
    });
    flushList();
    if (elements.length === 0) return <p className="text-sm sm:text-base leading-relaxed">{text}</p>;
    return <div className="space-y-1">{elements}</div>;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
    const questionText = inputMessage.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ question: questionText }),
        mode: 'cors',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(prev => [...prev, { text: data.answer, sender: 'bot', timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { text: data.message || 'Sorry, I encountered an error. Please try again.', sender: 'bot', timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later or contact us at Propertyreply1@gmail.com", sender: 'bot', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-[100dvh] min-h-[100vh] pt-safe pb-safe pl-safe pr-safe"
      role="dialog"
      aria-modal="true"
      aria-label="PropertyReply Demo Chat"
    >
      {/* Subtle grid / glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:48px_48px] pointer-events-none" />

      {/* Header */}
      <header
        className="relative flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border-b border-white/10 flex-shrink-0 min-h-[56px] sm:min-h-0"
        style={{
          background: 'linear-gradient(180deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.4) 100%)',
          boxShadow: '0 1px 0 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <i className="fas fa-robot text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">PropertyReply AI</h1>
            <p className="text-xs sm:text-sm text-white/60 truncate">Demo chat · We&apos;re here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Close demo chat"
        >
          <i className="fas fa-times text-base sm:text-lg md:text-xl" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-5 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id || msg.timestamp?.getTime?.() || Math.random()}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[80%] md:max-w-[70%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4 shadow-lg transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="break-words text-sm sm:text-base leading-relaxed">
                  {formatBotMessage(msg.text)}
                </div>
              ) : (
                <p className="text-sm sm:text-base leading-relaxed break-words">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/70 rounded-full animate-bounce" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - touch-friendly on mobile */}
      <div
        className="relative p-3 sm:p-5 md:p-6 pb-safe border-t border-white/10 flex-shrink-0"
        style={{
          background: 'linear-gradient(0deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.6) 100%)',
        }}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-4 items-stretch sm:items-center max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane text-base sm:text-lg md:text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullscreenChatbot;
