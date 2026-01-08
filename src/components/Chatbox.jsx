import React, { useState, useEffect, useRef } from 'react';

const Chatbox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm PropertyReply's AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        text: "Thank you for your interest! I'd be happy to help you learn more about PropertyReply. Would you like to schedule a demo? Please provide your email address and I'll have our team contact you.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
      
      // Simulate voice-to-text conversion
      const simulatedVoiceText = "Hello, I'm interested in learning more about PropertyReply services.";
      setInputMessage(simulatedVoiceText);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      
      // Simulate recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Request microphone permission (frontend simulation)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            // In a real implementation, you would process the audio stream here
            // For frontend demo, we'll just simulate it
            console.log('Microphone access granted');
          })
          .catch(err => {
            console.log('Microphone access denied:', err);
            setIsRecording(false);
            if (recordingIntervalRef.current) {
              clearInterval(recordingIntervalRef.current);
            }
          });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 w-full h-full sm:w-[90vw] sm:max-w-[400px] sm:h-[85vh] sm:max-h-[600px] sm:min-h-[500px] bg-dark-light/98 backdrop-blur-[20px] rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl border-0 sm:border-2 border-white/10 z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 sm:p-5 rounded-none sm:rounded-t-2xl md:rounded-t-3xl flex items-center justify-between flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-robot text-white text-lg sm:text-xl"></i>
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl">PropertyReply AI</h3>
            <p className="text-white/90 text-xs sm:text-sm">We're here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 shadow-md hover:scale-110"
          aria-label="Close chat"
        >
          <i className="fas fa-times text-base sm:text-lg"></i>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0 scroll-smooth">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-primary text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Animation Overlay */}
      {isRecording && (
        <div className="absolute inset-0 bg-gradient-to-b from-dark/98 to-dark/95 backdrop-blur-xl z-10 flex flex-col items-center justify-center p-4 sm:p-6 rounded-none sm:rounded-2xl md:rounded-3xl">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Outer Expanding Glow Rings - Multiple Layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Layer 1 - Largest */}
              <div 
                className="absolute w-full h-full rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 animate-ping blur-sm"
                style={{ animationDuration: '3s' }}
              ></div>
              {/* Layer 2 */}
              <div 
                className="absolute w-[85%] h-[85%] rounded-full bg-gradient-to-r from-blue-500/25 via-purple-500/25 to-pink-500/25 animate-ping blur-sm"
                style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
              ></div>
              {/* Layer 3 */}
              <div 
                className="absolute w-[70%] h-[70%] rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-ping blur-sm"
                style={{ animationDuration: '2s', animationDelay: '1s' }}
              ></div>
            </div>
            
            {/* Pulsing Ripple Rings - Sound Wave Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full border-4 border-purple-400/50 animate-pulse" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border-4 border-blue-400/50 animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-pink-400/50 animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Central 3D Speaker Icon with Glow */}
            <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-105">
              {/* Outer Glow */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '2s' }}></div>
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 blur-md opacity-40"></div>
              {/* Speaker Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 text-white relative z-10 drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              {/* Sparkle Effect */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          
          {/* Recording Text */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <span className="text-white text-base sm:text-lg md:text-xl font-semibold">
                Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-white/70 text-xs sm:text-sm md:text-base">Speak clearly into your microphone</p>
          </div>
          
          {/* Stop Button */}
          <button
            onClick={handleVoiceRecord}
            className="mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Stop Recording
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-white/20 bg-dark-light/50 backdrop-blur-sm flex-shrink-0 relative">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            disabled={isRecording}
            className="flex-1 min-w-0 bg-white/10 border border-white/30 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          />
          <button
            type="button"
            onClick={handleVoiceRecord}
            className={`${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg'
                : 'bg-gradient-primary hover:opacity-90 shadow-md'
            } text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center flex-shrink-0 min-w-[48px] sm:min-w-[56px]`}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isRecording}
            className="bg-gradient-primary text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg min-w-[48px] sm:min-w-[56px] max-w-[56px] sm:max-w-[64px]"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;