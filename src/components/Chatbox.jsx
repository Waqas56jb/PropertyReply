import React, { useState, useEffect, useRef } from 'react';

const Chatbox = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const audioElementsRef = useRef([]);
  const abortControllerRef = useRef(null);
  const accumulatedFinalTranscriptRef = useRef(''); // Component-level ref for accumulated transcript
  const lastSentTranscriptRef = useRef(''); // Track what we've already sent
  
  // Voice agent refs (following proven approach)
  const continuousModeRef = useRef(false); // Voice mode active?
  const speechBaseRef = useRef(''); // Accumulated final transcript
  const pauseTimerRef = useRef(null); // 1-second pause timer
  const isRestartingRef = useRef(false); // Preventing duplicate restarts
  const isPlayingAudioRef = useRef(false); // Bot currently speaking?
  const speechSynthesisRef = useRef(null); // TTS utterance
  const greetingSpokenRef = useRef(false); // Greeting already spoken?
  const isSpeakingGreetingRef = useRef(false); // Currently speaking greeting?
  const lastSpeechTimeRef = useRef(null); // Last time speech was detected

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format bot messages with proper line breaks, headings, and lists
  const formatBotMessage = (text) => {
    if (!text) return null;
    
    // Clean up the text: remove extra spaces, normalize hashtags, fix spacing issues
    let cleanedText = text
      .replace(/#{2,}\s+/g, '\n## ') // Add line break before headings
      .replace(/\s+#{2,}/g, '') // Remove trailing ##
      .replace(/\s+#{2,}\s+/g, '\n## ') // Handle ## in middle of text
      .replace(/(\d+)\s*\.\s*/g, '\n$1. ') // Fix "1 ." to "1." with line break
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .replace(/\n\s+/g, '\n') // Remove leading spaces after line breaks
      .trim();
    
    // Split by lines
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
      
      // Check for headings (## or #) - remove all # and clean
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
      }
      // Check for numbered lists (1. 2. etc.)
      else if (trimmed.match(/^\d+\.\s*/)) {
        const listItem = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (listItem) {
          currentList.push(listItem);
        }
      }
      // Check for bullet points (• or - or *)
      else if (trimmed.match(/^[•\-*]\s*/)) {
        const listItem = trimmed.replace(/^[•\-*]\s*/, '').trim();
        if (listItem) {
          currentList.push(listItem);
        }
      }
      // Regular paragraph
      else if (trimmed) {
        flushList();
        elements.push(
          <p key={`para-${key++}`} className="mb-2 text-sm sm:text-base leading-relaxed">
            {trimmed}
          </p>
        );
      }
    });

    flushList();

    // If no elements were created, return the original text as a paragraph
    if (elements.length === 0) {
      return <p className="text-sm sm:text-base leading-relaxed">{text}</p>;
    }

    return <div className="space-y-1">{elements}</div>;
  };

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

  // Play audio chunk - Reserved for future audio playback feature
  // eslint-disable-next-line no-unused-vars
  const playAudioChunk = async (audioBase64, mimeType = 'audio/mpeg') => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
        audioElementsRef.current.push(audio);
        
        audio.onended = () => {
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          reject(error);
        };
        
        audio.play().catch(reject);
      } catch (error) {
        console.error('Error playing audio:', error);
        reject(error);
      }
    });
  };

  // Send transcript to OpenAI and get TTS response
  const sendTranscriptToOpenAI = async (text) => {
    if (!text.trim() || text.length < 3) return;
    
    // Add user's voice-transcribed question to chat history (RIGHT SIDE)
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      setIsTyping(true);
      setIsPlayingAudio(true);
      
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      
      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      // Send to chatbot API
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question: text.trim() }),
        mode: 'cors',
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add bot's response to chat history (LEFT SIDE)
        const botResponse = {
          id: Date.now() + 1,
          text: data.answer,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Stop typing indicator immediately when response is received
        setIsTyping(false);
        
        // Generate and play TTS for the response using Web Speech API
        // TTS will automatically resume mic after speaking (handled in generateAndPlayTTS)
        await generateAndPlayTTS(data.answer, false);
        
        // Reset accumulated transcript for next question
        speechBaseRef.current = '';
        accumulatedFinalTranscriptRef.current = '';
        lastSentTranscriptRef.current = '';
      } else {
        const errorMessage = data.message || 'Sorry, I encountered an error. Please try again.';
        const botResponse = {
          id: Date.now() + 1,
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        setIsPlayingAudio(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        setIsTyping(false);
        return;
      }
      console.error('Error calling chatbot API:', error);
      const botResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setIsPlayingAudio(false);
    }
    // Note: isPlayingAudio will be set to false by TTS onend handler
  };

  // Generate TTS audio using OpenAI Alloy voice (with fallback to browser TTS)
  // CRITICAL: Stop mic before speaking to prevent feedback loop
  const generateAndPlayTTS = async (text, isGreeting = false) => {
    if (!text || !text.trim()) return Promise.resolve();
    
    // CRITICAL: Stop mic before speaking (prevent feedback loop)
    if (isRecording && speechRecognitionRef.current) {
      console.log('🛑 Stopping mic before speaking');
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
      setIsRecording(false);
    }
    
    const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
    
    // Try OpenAI TTS API first (Alloy voice model)
    try {
      console.log('🎙️ Generating TTS with OpenAI Alloy voice:', text.substring(0, 50) + '...');
      
      const response = await fetch(`${API_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          text: text.trim(),
          voice: 'alloy', // OpenAI Alloy voice model
          model: 'tts-1' // or 'tts-1-hd' for higher quality
        }),
        mode: 'cors',
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('✅ OpenAI TTS finished speaking');
            isPlayingAudioRef.current = false;
            setIsPlayingAudio(false);
            if (isGreeting) {
              isSpeakingGreetingRef.current = false;
            }
            
            // Resume mic after TTS
            setTimeout(() => {
              if (continuousModeRef.current && !isPlayingAudioRef.current) {
                console.log('🔄 Activating mic immediately after OpenAI TTS...');
                if (!isRecording) {
                  setIsRecording(true);
                  setIsTranscribing(true);
                }
                if (speechRecognitionRef.current) {
                  try {
                    speechRecognitionRef.current.stop();
                  } catch (e) {
                    // Ignore
                  }
                  speechRecognitionRef.current.onresult = null;
                  speechRecognitionRef.current.onerror = null;
                  speechRecognitionRef.current.onend = null;
                  speechRecognitionRef.current.onstart = null;
                  speechRecognitionRef.current = null;
                }
                setTimeout(() => {
                  if (continuousModeRef.current && !isPlayingAudioRef.current) {
                    startSpeechRecognition();
                    console.log('✅ Fresh recognition instance created - mic is ACTIVE');
                  }
                }, 200);
              }
            }, 100);
            
            resolve();
          };
          
          audio.onerror = (error) => {
            URL.revokeObjectURL(audioUrl);
            console.error('❌ OpenAI TTS playback error:', error);
            isPlayingAudioRef.current = false;
            setIsPlayingAudio(false);
            if (isGreeting) {
              isSpeakingGreetingRef.current = false;
            }
            reject(error);
          };
          
          isPlayingAudioRef.current = true;
          setIsPlayingAudio(true);
          if (isGreeting) {
            isSpeakingGreetingRef.current = true;
          }
          
          audio.play().catch(reject);
        });
      } else {
        // If OpenAI TTS fails, fall back to browser TTS
        console.log('⚠️ OpenAI TTS not available, falling back to browser TTS');
        throw new Error('OpenAI TTS not available');
      }
    } catch (error) {
      // Fallback to browser TTS if OpenAI TTS fails
      console.log('🔄 Using browser TTS as fallback');
      return generateBrowserTTS(text, isGreeting);
    }
  };
  
  // Fallback: Generate TTS using browser Web Speech API
  const generateBrowserTTS = async (text, isGreeting = false) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Browser does not support speech synthesis');
        setIsPlayingAudio(false);
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      console.log('🔊 Generating browser TTS for text:', text.substring(0, 50) + '...');
      
      // Cancel any ongoing speech
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      
      // Get available voices immediately (faster for greeting)
      let voices = window.speechSynthesis.getVoices();
      
      // Define createAndSpeak function first (before it's called)
      function createAndSpeak() {
          // Find best available FEMALE voice (prioritize female voices)
          const preferredFemaleVoices = [
            'Samantha',           // iOS (female, best quality)
            'Karen',              // iOS (female)
            'Victoria',           // iOS (female)
            'Microsoft Zira',     // Edge/Windows (female)
            'Microsoft Hazel',    // Edge/Windows (female)
            'Google UK English Female',  // Chrome (female)
            'Google US English Female',   // Chrome (female)
            'Samantha Enhanced',  // macOS (female)
            'Victoria Enhanced',  // macOS (female)
          ];
          
          // Fallback to any female voice
          const fallbackVoices = [
            'Alex',               // iOS (neutral)
            'Google US English',  // Chrome/Android
            'Microsoft David',    // Edge/Windows (male)
            'English (US)'        // Generic
          ];
          
          let selectedVoice = null;
          
          // First, try to find a preferred female voice
          for (const preferred of preferredFemaleVoices) {
            selectedVoice = voices.find(v => 
              v.name.includes(preferred) || 
              v.name.toLowerCase().includes(preferred.toLowerCase())
            );
            if (selectedVoice) break;
          }
          
          // If no preferred voice found, try to find any female voice
          if (!selectedVoice) {
            selectedVoice = voices.find(v => {
              const name = v.name.toLowerCase();
              return (v.lang.startsWith('en') && 
                      (name.includes('female') || 
                       name.includes('samantha') || 
                       name.includes('karen') || 
                       name.includes('victoria') ||
                       name.includes('zira') ||
                       name.includes('hazel')));
            });
          }
          
          // Last resort: use fallback voices
          if (!selectedVoice) {
            for (const fallback of fallbackVoices) {
              selectedVoice = voices.find(v => 
                v.name.includes(fallback) || 
                v.name.toLowerCase().includes(fallback.toLowerCase())
              );
              if (selectedVoice) break;
            }
          }
          
          // Final fallback: any English voice
          if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
          }
          
          // Create utterance
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          
          // INCREASED SPEED for faster narration (both greeting and responses)
          // Rate: 1.0 = normal, 1.2 = 20% faster, 1.3 = 30% faster
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (isIOS) {
            utterance.rate = 1.15;  // 15% faster for iOS
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
          } else {
            utterance.rate = 1.2;   // 20% faster for other platforms
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('✅ Using voice:', selectedVoice.name, '(Rate:', utterance.rate + ')');
          } else {
            console.log('⚠️ No voice selected, using default');
          }
          
          utterance.onstart = () => {
            console.log('✅ TTS started speaking');
            isPlayingAudioRef.current = true;
            setIsPlayingAudio(true);
            if (isGreeting) {
              isSpeakingGreetingRef.current = true;
            }
          };
          
          utterance.onend = () => {
            console.log('✅ TTS finished speaking - unblocking mic IMMEDIATELY');
            // IMMEDIATELY unblock mic (critical for real-time response)
            isPlayingAudioRef.current = false;
            setIsPlayingAudio(false);
            speechSynthesisRef.current = null;
            
            if (isGreeting) {
              isSpeakingGreetingRef.current = false;
            }
            
            // Resume mic IMMEDIATELY after TTS ends (CRITICAL for continuous conversation)
            // Always create a fresh recognition instance to ensure it works reliably
            setTimeout(() => {
              if (continuousModeRef.current && !isPlayingAudioRef.current) {
                console.log('🔄 Activating mic immediately after TTS - creating fresh instance...');
                
                // Ensure recording state is maintained
                if (!isRecording) {
                  setIsRecording(true);
                  setIsTranscribing(true);
                }
                
                // Always create a fresh instance for reliability
                // Clean up old instance first
                if (speechRecognitionRef.current) {
                  try {
                    speechRecognitionRef.current.stop();
                  } catch (e) {
                    // Ignore
                  }
                  speechRecognitionRef.current.onresult = null;
                  speechRecognitionRef.current.onerror = null;
                  speechRecognitionRef.current.onend = null;
                  speechRecognitionRef.current.onstart = null;
                  speechRecognitionRef.current = null;
                }
                
                // Small delay to ensure cleanup is complete
                setTimeout(() => {
                  if (continuousModeRef.current && !isPlayingAudioRef.current) {
                    // Create fresh recognition instance
                    startSpeechRecognition();
                    console.log('✅ Fresh recognition instance created - mic is ACTIVE');
                  }
                }, 200);
              }
            }, 100); // Minimal delay - mic becomes active almost immediately
            
            resolve();
          };
          
          utterance.onerror = (error) => {
            // Handle 'interrupted' errors silently (common when new speech starts)
            if (error.error === 'interrupted' || error.error === 'canceled') {
              console.log('ℹ️ TTS interrupted/canceled (normal)');
            } else {
              console.error('❌ Speech synthesis error:', error.error);
            }
            // Always unblock mic on error
            isPlayingAudioRef.current = false;
            setIsPlayingAudio(false);
            speechSynthesisRef.current = null;
            if (isGreeting) {
              isSpeakingGreetingRef.current = false;
            }
            // Resume mic even on error
            setTimeout(() => {
              if (continuousModeRef.current && !isPlayingAudioRef.current && isRecording) {
                if (speechRecognitionRef.current) {
                  try {
                    speechRecognitionRef.current.start();
                    console.log('✅ Mic reactivated after TTS error');
                  } catch (e) {
                    // Ignore
                  }
                }
              }
            }, 200);
            reject(error);
          };
          
          speechSynthesisRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
        
      // If no voices, wait for them to load (but with shorter delay for greeting)
      if (voices.length === 0) {
        const loadVoices = () => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            createAndSpeak();
          } else {
            setTimeout(loadVoices, isGreeting ? 50 : 100); // Faster for greeting
          }
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
      } else {
        // For greeting, start immediately; for responses, small delay for cancellation
        if (isGreeting) {
          createAndSpeak();
        } else {
          setTimeout(() => {
            createAndSpeak();
          }, 50); // Minimal delay for responses
        }
      }
    });
  };

  // Cleanup function for speech recognition (proven approach)
  const cleanupRecognition = () => {
    if (speechRecognitionRef.current) {
      try {
        // Remove event handlers first
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.onstart = null;
        
        // Stop recognition
        speechRecognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
      
      // Clear reference
      speechRecognitionRef.current = null;
    }
    
    // Clear pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };
  
  // Stop all speech (proven approach)
  const stopAllSpeech = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      speechSynthesisRef.current = null;
    }
    isPlayingAudioRef.current = false;
    setIsPlayingAudio(false);
    isSpeakingGreetingRef.current = false;
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // User stopping - disable continuous mode
      continuousModeRef.current = false;
      stopAllSpeech();
      cleanupRecognition();
      stopRecording();
    } else if (isPlayingAudio) {
      // Block recording while audio is playing
      return;
    } else {
      // User starting - enable continuous mode
      continuousModeRef.current = true;
      
      // Reset speech base
      speechBaseRef.current = '';
      accumulatedFinalTranscriptRef.current = '';
      lastSentTranscriptRef.current = '';
      setInputMessage('');
      
      // Speak greeting IMMEDIATELY on first mic click (only once, simultaneously with mic click)
      // Use a flag to prevent double greeting
      if (!greetingSpokenRef.current && !isSpeakingGreetingRef.current) {
        greetingSpokenRef.current = true;
        isSpeakingGreetingRef.current = true;
        const greetingMessage = "Hello! I'm PropertyReply's AI assistant. How can I help you today?";
        
        // Play greeting immediately using OpenAI Alloy voice (don't wait for startRecording)
        // This ensures greeting happens simultaneously with mic click
        generateAndPlayTTS(greetingMessage, true).catch((error) => {
          console.error('Greeting TTS error:', error);
          isSpeakingGreetingRef.current = false;
        });
      }
      
      // Start recording (runs in parallel with greeting)
      await startRecording();
    }
  };
  
  // Start speech recognition (proven approach)
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.log('Voice input not supported in this browser');
      return;
    }
    
    // Cleanup before creating new instance
    cleanupRecognition();
    
    setTimeout(() => {
      if (!continuousModeRef.current || isRestartingRef.current) {
        return;
      }
      createRecognitionInstance();
    }, 150);
  };
  
  // Create recognition instance (proven approach)
  const createRecognitionInstance = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;      // Get partial results while speaking
    recognition.continuous = true;         // Keep listening continuously
    recognition.maxAlternatives = 1;       // Only best match
    recognition.lang = 'en-US';            // Language
    
    // Reset speech tracking
    speechBaseRef.current = '';
    accumulatedFinalTranscriptRef.current = '';
    setInputMessage('');
    
    recognition.onstart = () => {
      console.log('✅ Speech recognition started and listening...');
      setIsTranscribing(true);
      isRestartingRef.current = false;
      // Ensure mic is unblocked when recognition starts
      isPlayingAudioRef.current = false;
      isSpeakingGreetingRef.current = false;
    };
    
    // CRITICAL: Set up onresult handler for real-time transcription
    recognition.onresult = (event) => {
      // CRITICAL: Block ALL processing if bot is speaking (prevent feedback loop)
      if (isPlayingAudioRef.current || isSpeakingGreetingRef.current) {
        return; // Mic is muted during agent speech
      }
      
      // CRITICAL: Verify this recognition instance is still active
      if (!speechRecognitionRef.current || speechRecognitionRef.current !== recognition) {
        return; // Recognition was stopped/cleaned up
      }
      
      let interimTranscript = '';
      let finalTranscript = '';
      let hasInterimResults = false;
      
      // Process all results from the last result index (token by token)
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result || !result[0]) continue;
        
        const transcript = result[0].transcript || '';
        
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
          hasInterimResults = true;
        }
      }
      
      // Only process if we have actual transcript
      if (!interimTranscript && !finalTranscript) {
        return;
      }
      
      // Accumulate final transcripts
      if (finalTranscript) {
        const base = speechBaseRef.current;
        const normalizedBase = base.toLowerCase();
        const normalizedFinal = finalTranscript.toLowerCase();
        
        if (!normalizedBase.endsWith(normalizedFinal)) {
          const updatedBase = [base, finalTranscript]
            .filter(Boolean)
            .join(base ? ' ' : '')
            .trim();
          speechBaseRef.current = updatedBase;
          accumulatedFinalTranscriptRef.current = updatedBase;
        }
      }
      
      lastSpeechTimeRef.current = Date.now();
      
      // Update UI with real-time transcript (REAL-TIME RESPONSIVE)
      const displayText = speechBaseRef.current + (interimTranscript ? ' ' + interimTranscript : '');
      setTranscript(displayText);
      setInputMessage(displayText);
      
      // Log real-time transcription
      if (interimTranscript) {
        console.log('🎤 Real-time interim:', interimTranscript);
      }
      if (finalTranscript) {
        console.log('✅ Final:', finalTranscript);
      }
      if (displayText.trim()) {
        console.log('📝 Full transcript:', displayText);
      }
      
      // Clear existing pause timer
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      
      // PAUSE DETECTION: If user stopped speaking, start 1-second timer
      const finalValue = speechBaseRef.current || '';
      
      if (!hasInterimResults && 
          finalValue && finalValue.trim() && 
          continuousModeRef.current && 
          !isPlayingAudioRef.current && 
          !isSpeakingGreetingRef.current) {
        
        pauseTimerRef.current = setTimeout(() => {
          const currentText = speechBaseRef.current || '';
          const textToSend = currentText.trim();
          
          if (textToSend && 
              continuousModeRef.current && 
              !isPlayingAudioRef.current &&
              !isSpeakingGreetingRef.current) {
            
            console.log('🚀 Auto-sending after 1+ second pause:', textToSend);
            
            if (speechRecognitionRef.current) {
              try {
                speechRecognitionRef.current.stop();
              } catch (e) {
                // Ignore
              }
            }
            
            pauseTimerRef.current = null;
            speechBaseRef.current = '';
            accumulatedFinalTranscriptRef.current = '';
            setTranscript('');
            setInputMessage('');
            
            sendTranscriptToOpenAI(textToSend);
          }
        }, 1000);
      }
    };
    
    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        return; // Normal, continue listening
      } else if (event.error === 'aborted') {
        return; // Normal when stopping
      } else {
        console.warn('Speech recognition warning:', event.error);
      }
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended (createRecognitionInstance) - attempting restart...');
      // Auto-restart if still in continuous mode (CRITICAL for continuous conversation)
      if (continuousModeRef.current && !isPlayingAudioRef.current && !isSpeakingGreetingRef.current) {
        // Only auto-restart if this is still the current recognition instance
        if (speechRecognitionRef.current === recognition) {
          isRestartingRef.current = true;
          setTimeout(() => {
            // Double-check conditions before restarting
            if (continuousModeRef.current && 
                !isPlayingAudioRef.current && 
                !isSpeakingGreetingRef.current && 
                speechRecognitionRef.current === recognition &&
                isRecording) {
              try {
                recognition.start();
                console.log('🔄 Recognition auto-restarted (createRecognitionInstance onend)');
                isRestartingRef.current = false;
              } catch (e) {
                console.log('⚠️ Auto-restart error, will retry:', e.message);
                // Retry once more
                setTimeout(() => {
                  if (continuousModeRef.current && 
                      !isPlayingAudioRef.current && 
                      !isSpeakingGreetingRef.current && 
                      speechRecognitionRef.current === recognition &&
                      isRecording) {
                    try {
                      recognition.start();
                      console.log('✅ Recognition auto-restarted after retry');
                      isRestartingRef.current = false;
                    } catch (err) {
                      console.error('❌ Failed to auto-restart recognition:', err);
                      isRestartingRef.current = false;
                    }
                  }
                }, 500);
              }
            } else {
              isRestartingRef.current = false;
            }
          }, 300);
        } else {
          console.log('ℹ️ Recognition instance changed, not restarting old instance');
        }
      } else {
        console.log('⏸️ Not restarting - continuous:', continuousModeRef.current, 
                   'audio:', isPlayingAudioRef.current, 
                   'greeting:', isSpeakingGreetingRef.current,
                   'recording:', isRecording);
      }
    };
    
    speechRecognitionRef.current = recognition;
    
    // Ensure recording state is set
    if (!isRecording) {
      setIsRecording(true);
      setIsTranscribing(true);
    }
    
    try {
      console.log('🎤 Starting recognition instance...');
      recognition.start();
      console.log('✅ Recognition instance started successfully');
    } catch (e) {
      console.error('❌ Error starting recognition:', e);
      // If start fails, try again after a short delay
      setTimeout(() => {
        if (continuousModeRef.current && speechRecognitionRef.current === recognition) {
          try {
            recognition.start();
            console.log('✅ Recognition instance started after retry');
          } catch (err) {
            console.error('❌ Failed to start recognition after retry:', err);
          }
        }
      }, 500);
    }
  };

  const startRecording = async () => {
    try {
      // Check if browser supports Web Speech API
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
        return;
      }

      setIsRecording(true);
      setIsTranscribing(true);
      setRecordingTime(0);
      setAudioLevel(0);
      setTranscript('');
      setInputMessage('');
      
      // Reset transcript tracking
      accumulatedFinalTranscriptRef.current = '';
      lastSentTranscriptRef.current = '';
      
      // Request microphone access first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context for visual feedback
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
          if (!analyserRef.current || !isRecording) {
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
      
      // Initialize Web Speech API for real-time transcription
      // Cross-platform support for both mobile and desktop
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
        setIsRecording(false);
        setIsTranscribing(false);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true; // Get real-time results
      recognition.lang = 'en-US';
      
      // Mobile-specific settings
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        // On mobile, ensure we get results more frequently
        recognition.maxAlternatives = 1;
      }
      
      speechRecognitionRef.current = recognition;
      
      // Handle recognition start
      recognition.onstart = () => {
        console.log('✅ Speech recognition started and listening - mic is ACTIVE');
        setIsTranscribing(true);
        // Ensure mic is unblocked when recognition starts
        isPlayingAudioRef.current = false;
        isSpeakingGreetingRef.current = false;
      };
      
      recognition.onresult = (event) => {
        // CRITICAL: Block processing if bot is speaking (prevent feedback loop)
        // But check state at the moment of processing (not when event was created)
        const isAudioCurrentlyPlaying = isPlayingAudioRef.current || isSpeakingGreetingRef.current;
        
        if (isAudioCurrentlyPlaying) {
          // Silently ignore - don't log every time to avoid console spam
          return; // Completely ignore speech input while audio is playing
        }
        
        let interimTranscript = '';
        let finalTranscript = '';
        let hasInterimResults = false;
        
        // Process all results from the last result index (token by token)
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';
          
          if (result.isFinal) {
            // Final result - user finished this sentence
            finalTranscript += transcript;
          } else {
            // Interim result - user is still speaking
            interimTranscript += transcript;
            hasInterimResults = true;
          }
        }
        
        // Accumulate final transcripts
        if (finalTranscript) {
          const base = speechBaseRef.current;
          const normalizedBase = base.toLowerCase();
          const normalizedFinal = finalTranscript.toLowerCase();
          
          // Avoid duplicates
          if (!normalizedBase.endsWith(normalizedFinal)) {
            const updatedBase = [base, finalTranscript]
              .filter(Boolean)
              .join(base ? ' ' : '')
              .trim();
            speechBaseRef.current = updatedBase;
            accumulatedFinalTranscriptRef.current = updatedBase;
          }
        }
        
        // Update last speech time
        lastSpeechTimeRef.current = Date.now();
        
        // Update UI with real-time transcript (REAL-TIME RESPONSIVE)
        const displayText = speechBaseRef.current + (interimTranscript ? ' ' + interimTranscript : '');
        setTranscript(displayText);
        setInputMessage(displayText);
        
        // Log only when we have meaningful transcript
        if (displayText.trim()) {
          console.log('🎤 Real-time transcript:', displayText);
        }
        
        // Clear existing pause timer when new speech arrives
        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }
        
        // PAUSE DETECTION LOGIC (PROVEN APPROACH):
        // If user stopped speaking (no interim results) AND we have text,
        // start 1-second timer to auto-send
        const finalValue = speechBaseRef.current || '';
        
        if (!hasInterimResults &&                    // User stopped speaking (no interim results)
            finalValue && finalValue.trim() &&       // We have text
            continuousModeRef.current &&             // Still in voice mode
            !isPlayingAudioRef.current &&            // Bot not speaking
            !isSpeakingGreetingRef.current) {        // Greeting not playing
          
          // Start 1-second pause timer (MORE THAN 1 SECOND PAUSE)
          pauseTimerRef.current = setTimeout(() => {
            // Double-check conditions before sending
            const currentText = speechBaseRef.current || '';
            const textToSend = currentText.trim();
            
            if (textToSend && 
                continuousModeRef.current && 
                !isPlayingAudioRef.current &&
                !isSpeakingGreetingRef.current) {
              
              console.log('🚀 Auto-sending after 1+ second pause:', textToSend);
              
              // Stop recognition temporarily (will restart after response)
              if (speechRecognitionRef.current) {
                try {
                  speechRecognitionRef.current.stop();
                } catch (e) {
                  // Ignore
                }
              }
              
              // Clear timer
              pauseTimerRef.current = null;
              
              // Reset speech tracking
              speechBaseRef.current = '';
              accumulatedFinalTranscriptRef.current = '';
              setTranscript('');
              setInputMessage('');
              
              // Send message to OpenAI
              sendTranscriptToOpenAI(textToSend).then(() => {
                // After response TTS finishes, recognition will restart automatically
                // (handled in generateAndPlayTTS onend handler)
              });
            }
          }, 1000);  // 1 SECOND PAUSE DETECTION
        }
      };
      
      recognition.onerror = (event) => {
        // Handle different error types
        if (event.error === 'no-speech') {
          // No speech detected - this is normal, continue listening silently
          // Don't log this as it's very common and clogs the console
          // The recognition will automatically restart via onend
          return;
        } else if (event.error === 'aborted') {
          // Recognition was aborted - normal when stopping
          console.log('Recognition aborted (normal)');
          return;
        } else if (event.error === 'audio-capture') {
          // No microphone found
          console.error('No microphone found');
          setIsRecording(false);
          setIsTranscribing(false);
          alert('No microphone found. Please connect a microphone and try again.');
        } else if (event.error === 'not-allowed') {
          // Microphone permission denied
          console.error('Microphone permission denied');
          setIsRecording(false);
          setIsTranscribing(false);
          alert('Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.');
        } else if (event.error === 'network') {
          // Network error
          console.error('Network error');
          setIsRecording(false);
          setIsTranscribing(false);
          alert('Network error. Please check your internet connection and try again.');
        } else if (event.error === 'service-not-allowed') {
          // Service not allowed
          console.error('Service not allowed');
          setIsRecording(false);
          setIsTranscribing(false);
          alert('Speech recognition service is not available. Please try again later.');
        } else {
          // Other errors - log but don't stop (let it continue and restart)
          console.warn('Speech recognition warning:', event.error);
          // Don't stop on minor errors, let it continue and restart via onend
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended - attempting restart...');
        // Auto-restart if still recording (for continuous listening - unlimited Q&A)
        if (isRecording && speechRecognitionRef.current) {
          // Use a slightly longer delay to ensure clean restart
          setTimeout(() => {
            if (continuousModeRef.current && 
                !isPlayingAudioRef.current && 
                !isSpeakingGreetingRef.current &&
                speechRecognitionRef.current === recognition) {
              try {
                console.log('🔄 Auto-restarting speech recognition...');
                recognition.start();
                console.log('✅ Speech recognition restarted successfully');
              } catch (e) {
                console.log('⚠️ Recognition restart error, will retry:', e.message);
                // Retry after delay
                setTimeout(() => {
                  if (continuousModeRef.current && 
                      !isPlayingAudioRef.current && 
                      !isSpeakingGreetingRef.current &&
                      speechRecognitionRef.current === recognition) {
                    try {
                      recognition.start();
                      console.log('✅ Speech recognition restarted after retry');
                    } catch (err) {
                      console.error('❌ Failed to restart recognition:', err);
                    }
                  }
                }, 500);
              }
            }
          }, 300);
        } else {
          console.log('⏸️ Not restarting - continuous:', continuousModeRef.current, 
                     'audio:', isPlayingAudioRef.current, 
                     'greeting:', isSpeakingGreetingRef.current);
        }
      };
      
        // Start recognition
        try {
          console.log('Starting speech recognition...');
          recognition.start();
          // DO NOT play greeting here - it's handled in handleVoiceRecord for first time only
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        setIsRecording(false);
        setIsTranscribing(false);
        alert('Failed to start speech recognition. Please try again.');
      }
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
      setIsTranscribing(false);
      alert('Microphone access denied. Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    continuousModeRef.current = false;
    setIsRecording(false);
    setIsTranscribing(false);
    setAudioLevel(0);
    
    // Cleanup recognition (proven approach)
    cleanupRecognition();
    
    // Clear pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
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
    
    // Close audio context (only if not already closed)
    if (audioContextRef.current) {
      try {
        // Check if AudioContext is not already closed
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (e) {
        // Ignore errors if already closed
        console.log('AudioContext already closed or error closing:', e.message);
      }
      audioContextRef.current = null;
    }
    
    // Reset all speech tracking
    speechBaseRef.current = '';
    accumulatedFinalTranscriptRef.current = '';
    lastSentTranscriptRef.current = '';
    setTranscript('');
    setInputMessage('');
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
        try {
          // Check if AudioContext is not already closed
          if (audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        } catch (e) {
          // Ignore errors if already closed
          console.log('AudioContext already closed or error closing:', e.message);
        }
        audioContextRef.current = null;
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {
          // Already stopped
        }
        speechRecognitionRef.current = null;
      }
      // Capture pause timer ref value for cleanup
      const pauseTimer = pauseTimerRef.current;
      if (pauseTimer) {
        clearTimeout(pauseTimer);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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

      {/* Messages - Global Chat Format: User Questions (Right), Bot Answers (Left) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id || msg.timestamp?.getTime() || Math.random()}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-md transition-all duration-200 ${
                msg.sender === 'user'
                  ? 'bg-gradient-primary text-white'
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

      {/* Recording Animation Overlay - Transparent so input field is visible */}
      {isRecording && (
        <div className="absolute inset-0 bg-gradient-to-br from-dark/30 via-dark/20 to-dark/30 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 sm:p-6 rounded-none sm:rounded-2xl md:rounded-3xl">
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
            <p className="text-white/60 text-sm sm:text-base font-medium">
              {isTranscribing ? 'Listening... Speak clearly' : 'Processing...'}
            </p>
            
            {/* Real-time Transcript Display */}
            {transcript && (
              <div className="mt-4 sm:mt-6 w-full max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed break-words">
                    <span className="text-white font-semibold">You said:</span>{' '}
                    <span className={transcript.includes('...') ? 'text-white/70 italic' : 'text-white'}>
                      {transcript}
                    </span>
                  </p>
                </div>
              </div>
            )}
            
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
          
          {/* Stop Button - Modern Design - Clickable through transparent overlay */}
          <button
            onClick={handleVoiceRecord}
            className="mt-6 sm:mt-8 px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-200 flex items-center gap-3 active:scale-95 transform relative z-20"
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

      {/* Input - Always visible, mic button replaced with stop when recording */}
      <form onSubmit={handleSendMessage} className="p-4 sm:p-5 border-t border-white/20 bg-dark-light/50 backdrop-blur-sm flex-shrink-0 relative">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isRecording ? "Speaking..." : "Type your message..."}
            disabled={isRecording}
            className="flex-1 min-w-0 bg-white/10 border border-white/30 rounded-xl px-4 py-3 sm:px-5 sm:py-3.5 text-base text-white placeholder-white/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  disabled={isPlayingAudio && !isRecording}
                  className={`${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg'
                      : isPlayingAudio
                      ? 'bg-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-primary hover:opacity-90 shadow-md'
                  } text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center flex-shrink-0 min-w-[48px] sm:min-w-[56px]`}
                  aria-label={isRecording ? "Stop recording" : isPlayingAudio ? "Audio playing" : "Start voice recording"}
                >
                  {isRecording ? (
              <>
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
                <span className="hidden sm:inline text-sm font-bold ml-2">Stop</span>
              </>
            ) : isPlayingAudio ? (
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
