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
  const [audioLevel, setAudioLevel] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const questionText = inputMessage.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call chatbot API
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question: questionText }),
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botResponse = {
          text: data.answer,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Handle API error
        const errorMessage = data.message || 'Sorry, I encountered an error. Please try again.';
        const botResponse = {
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      const botResponse = {
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later or contact us directly at info@propertyreply.com',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording
      stopRecording();
    } else {
      // Start recording
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      setAudioLevel(0);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context for real-time analysis
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      const startMonitoring = () => {
        if (!analyserRef.current) return;
        
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateLevel = () => {
          if (!analyserRef.current) {
            setAudioLevel(0);
            return;
          }
          
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const normalizedLevel = Math.min(average / 128, 1);
          setAudioLevel(normalizedLevel);
          
          if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          }
        };
        
        updateLevel();
      };
      
      startMonitoring();
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
      alert('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAudioLevel(0);
    
    // Stop timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Simulate voice-to-text conversion (in production, use a speech-to-text API)
    const simulatedVoiceText = "Hello, I'm interested in learning more about PropertyReply services.";
    setInputMessage(simulatedVoiceText);
  };

  // Cleanup audio monitoring when recording stops
  useEffect(() => {
    if (!isRecording) {
      setAudioLevel(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
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

      {/* Recording Animation Overlay - Full Screen Modern Design */}
      {isRecording && (
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/98 to-dark/95 backdrop-blur-2xl z-10 flex flex-col items-center justify-center p-4 sm:p-6 rounded-none sm:rounded-2xl md:rounded-3xl">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Dynamic Audio-Responsive Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Glow - Responds to Audio */}
              <div 
                className="absolute rounded-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 blur-xl transition-all duration-100"
                style={{ 
                  width: `${100 + audioLevel * 30}%`, 
                  height: `${100 + audioLevel * 30}%`,
                  opacity: 0.3 + audioLevel * 0.4
                }}
              ></div>
              
              {/* Expanding Rings - Multiple Layers */}
              <div 
                className="absolute w-full h-full rounded-full bg-gradient-radial from-purple-500/25 via-transparent to-transparent animate-ping"
                style={{ animationDuration: '3s' }}
              ></div>
              <div 
                className="absolute w-[90%] h-[90%] rounded-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent animate-ping"
                style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}
              ></div>
              <div 
                className="absolute w-[80%] h-[80%] rounded-full bg-gradient-radial from-pink-500/15 via-transparent to-transparent animate-ping"
                style={{ animationDuration: '2s', animationDelay: '0.8s' }}
              ></div>
            </div>
            
            {/* Sound Wave Ripples - Audio Responsive */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="absolute rounded-full border-2 border-purple-400/60 transition-all duration-75"
                style={{ 
                  width: `${60 + audioLevel * 40}%`, 
                  height: `${60 + audioLevel * 40}%`,
                  opacity: 0.4 + audioLevel * 0.6
                }}
              ></div>
              <div 
                className="absolute rounded-full border-2 border-blue-400/60 transition-all duration-75"
                style={{ 
                  width: `${50 + audioLevel * 35}%`, 
                  height: `${50 + audioLevel * 35}%`,
                  opacity: 0.4 + audioLevel * 0.6,
                  animationDelay: '0.2s'
                }}
              ></div>
              <div 
                className="absolute rounded-full border-2 border-pink-400/60 transition-all duration-75"
                style={{ 
                  width: `${40 + audioLevel * 30}%`, 
                  height: `${40 + audioLevel * 30}%`,
                  opacity: 0.4 + audioLevel * 0.6,
                  animationDelay: '0.4s'
                }}
              ></div>
            </div>
            
            {/* Central 3D Speaker Icon - Audio Responsive Scale */}
            <div 
              className="relative z-10 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center shadow-2xl transition-all duration-75"
              style={{
                width: `${32 + audioLevel * 8}%`,
                height: `${32 + audioLevel * 8}%`,
                minWidth: '120px',
                minHeight: '120px',
                maxWidth: '160px',
                maxHeight: '160px'
              }}
            >
              {/* Multi-layer Glow Effect */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '2s' }}></div>
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 blur-lg opacity-40"></div>
              
              {/* Speaker Icon - Scales with Audio */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-white relative z-10 drop-shadow-2xl transition-transform duration-75"
                style={{
                  width: `${40 + audioLevel * 10}%`,
                  height: `${40 + audioLevel * 10}%`,
                  minWidth: '48px',
                  minHeight: '48px'
                }}
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
              
              {/* Animated Sparkles */}
              <div className="absolute -top-3 -right-3 w-4 h-4 bg-yellow-400 rounded-full animate-ping shadow-lg shadow-yellow-400/50"></div>
              <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-blue-300 rounded-full animate-ping shadow-lg shadow-blue-300/50" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-0 -left-6 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -top-6 right-0 w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
          
          {/* Recording Status - Modern Design */}
          <div className="mt-8 sm:mt-10 text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/60"></div>
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                Recording
              </span>
              <span className="text-white/80 text-lg sm:text-xl md:text-2xl font-mono font-semibold">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-white/60 text-sm sm:text-base font-medium">Speak clearly into your microphone</p>
            
            {/* Audio Level Indicator */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-400 via-blue-400 to-pink-400 rounded-full transition-all duration-75"
                  style={{
                    height: `${8 + (audioLevel * (i < 10 ? i : 20 - i)) * 20}px`,
                    opacity: audioLevel > i / 20 ? 0.6 + audioLevel * 0.4 : 0.2
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Stop Button - Modern Design */}
          <button
            onClick={handleVoiceRecord}
            className="mt-6 sm:mt-8 px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-200 flex items-center gap-3 active:scale-95 transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
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
            <span>Stop Recording</span>
          </button>
        </div>
      )}

      {/* Input - Hidden when recording */}
      {!isRecording && (
        <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-white/20 bg-dark-light/50 backdrop-blur-sm flex-shrink-0 relative">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-w-0 bg-white/10 border border-white/30 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 shadow-inner"
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
      )}
    </div>
  );
};

export default Chatbox;