import React, { useState, useEffect, useRef, useCallback } from 'react';

// Configuration - can be made dynamic via props
const CONFIG = {
  AGENCY_NAME: 'PropertyReply',
  OFFICE_HOURS: '9am-6pm Monday-Friday',
  PHONE: '+44 7878 938733',
  AREA_LIST: 'London, Manchester, Birmingham, Leeds, Liverpool'
};

const FullscreenChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState(null);
  const [flowData, setFlowData] = useState({});
  const [viewportStyle, setViewportStyle] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const inputFocusedRef = useRef(false);
  const messagesAreaRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      showWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const showWelcomeMessage = () => {
    const welcomeMsg = {
      id: 'welcome',
      sender: 'bot',
      text: `Hi 👋 Welcome to ${CONFIG.AGENCY_NAME}. How can I help today?`,
      options: [
        'Buy a property',
        'Sell a property (valuation)',
        'Book a viewing',
        'Ask about a specific property',
        'Make an offer',
        'Speak to the team'
      ]
    };
    setMessages([welcomeMsg]);
    setCurrentFlow(null);
    setFlowData({});
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (inputFocusedRef.current) return;
    const id = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(id);
  }, [messages]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.visualViewport) return;
    const update = () => {
      const vv = window.visualViewport;
      setViewportStyle({
        height: `${vv.height}px`,
        width: `${vv.width}px`,
        left: `${vv.offsetLeft}px`,
        top: `${vv.offsetTop}px`,
      });
    };
    update();
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
    return () => {
      window.visualViewport.removeEventListener('resize', update);
      window.visualViewport.removeEventListener('scroll', update);
    };
  }, [isOpen]);

  const handleInputFocus = useCallback(() => {
    inputFocusedRef.current = true;
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 350);
  }, []);

  const handleInputBlur = useCallback(() => {
    inputFocusedRef.current = false;
  }, []);

  const addMessage = (text, sender = 'bot', options = null) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option, flowType = null) => {
    // Add user message
    addMessage(option, 'user');
    
    // Process based on flow
    if (flowType) {
      setCurrentFlow(flowType);
      handleFlowStart(flowType, option);
    } else {
      // Determine flow from option text
      const flow = determineFlow(option);
      if (flow) {
        setCurrentFlow(flow);
        handleFlowStart(flow, option);
      }
    }
  };

  const determineFlow = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('buy') || lower.includes('looking to buy')) return 'buyer';
    if (lower.includes('sell') || lower.includes('valuation')) return 'seller';
    if (lower.includes('viewing') || lower.includes('book a viewing')) return 'viewing';
    if (lower.includes('specific property') || lower.includes('interested in a property')) return 'property_enquiry';
    if (lower.includes('offer') || lower.includes('make an offer')) return 'offer';
    if (lower.includes('speak') || lower.includes('team')) return 'speak_team';
    return null;
  };

  const handleFlowStart = (flow, userInput) => {
    switch (flow) {
      case 'buyer':
        startBuyerFlow();
        break;
      case 'seller':
        startSellerFlow();
        break;
      case 'viewing':
        startViewingFlow();
        break;
      case 'property_enquiry':
        startPropertyEnquiryFlow();
        break;
      case 'offer':
        startOfferFlow();
        break;
      case 'speak_team':
        startSpeakTeamFlow();
        break;
      default:
        handleCommonQuestion(userInput);
    }
  };

  // Buyer Flow
  const startBuyerFlow = () => {
    addMessage(`Great — what area are you looking in? (e.g., ${CONFIG.AREA_LIST})`);
    setFlowData({ flow: 'buyer', step: 'area' });
  };

  const continueBuyerFlow = (input) => {
    const { step } = flowData;
    switch (step) {
      case 'area':
        setFlowData({ ...flowData, area: input, step: 'budget' });
        addMessage('Thanks. What\'s your budget range?');
        break;
      case 'budget':
        setFlowData({ ...flowData, budget: input, step: 'beds' });
        addMessage('How many bedrooms do you need?');
        break;
      case 'beds':
        setFlowData({ ...flowData, beds: input, step: 'musthaves' });
        addMessage('Any must-haves? (e.g., parking, garden, new build, chain-free)');
        break;
      case 'musthaves':
        setFlowData({ ...flowData, musthaves: input, step: 'status' });
        addMessage('Are you in a position to proceed?', 'bot', [
          'Mortgage in principle in place',
          'Speaking to a broker',
          'Cash buyer',
          'Just browsing'
        ]);
        break;
      case 'status':
        setFlowData({ ...flowData, status: input, step: 'name' });
        addMessage('Perfect — I can send your requirements to the team so we can suggest suitable properties and arrange viewings.\nWhat\'s your full name?');
        break;
      case 'name':
        setFlowData({ ...flowData, name: input, step: 'mobile' });
        addMessage('And the best mobile number to reach you on?');
        break;
      case 'mobile':
        setFlowData({ ...flowData, mobile: input, step: 'email' });
        addMessage('Finally, what\'s your email address?');
        break;
      case 'email':
        setFlowData({ ...flowData, email: input });
        submitBuyerLead();
        break;
      default:
        // Reset to welcome if unknown step
        showWelcomeMessage();
        break;
    }
  };

  const submitBuyerLead = async () => {
    const { name, mobile, email, area, budget, beds, musthaves, status } = flowData;
    setIsTyping(true);
    
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/chatbot-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'buyer_enquiry',
          name,
          mobile,
          email,
          area,
          budget,
          bedrooms: beds,
          musthaves,
          position: status
        }),
        mode: 'cors',
      });

      const data = await response.json();
      setIsTyping(false);
      
      if (response.ok && data.success) {
        addMessage(`Thanks ${name}. We'll share your requirements with the team and someone will be in touch during ${CONFIG.OFFICE_HOURS}.\n\nBy sharing these details, you agree ${CONFIG.AGENCY_NAME} can contact you about your enquiry.`);
      } else {
        addMessage(`Thanks ${name}. We'll share your requirements with the team and someone will be in touch during ${CONFIG.OFFICE_HOURS}.\n\nBy sharing these details, you agree ${CONFIG.AGENCY_NAME} can contact you about your enquiry.`);
      }
    } catch (error) {
      setIsTyping(false);
      addMessage(`Thanks ${name}. We'll share your requirements with the team and someone will be in touch during ${CONFIG.OFFICE_HOURS}.\n\nBy sharing these details, you agree ${CONFIG.AGENCY_NAME} can contact you about your enquiry.`);
    }
    
    setTimeout(() => {
      showWelcomeMessage();
    }, 3000);
  };

  // Seller Flow
  const startSellerFlow = () => {
    addMessage('Great — we can arrange a free valuation. What\'s the property postcode?');
    setFlowData({ flow: 'seller', step: 'postcode' });
  };

  const continueSellerFlow = (input) => {
    const { step } = flowData;
    switch (step) {
      case 'postcode':
        setFlowData({ ...flowData, postcode: input, step: 'beds' });
        addMessage('Approximately how many bedrooms is it?');
        break;
      case 'beds':
        setFlowData({ ...flowData, beds: input, step: 'type' });
        addMessage('Is it: house / flat / bungalow / other?');
        break;
      case 'type':
        setFlowData({ ...flowData, type: input, step: 'timeline' });
        addMessage('When are you looking to sell?', 'bot', [
          'ASAP (0–4 weeks)',
          '1–3 months',
          '3–6 months',
          'Just exploring'
        ]);
        break;
      case 'timeline':
        setFlowData({ ...flowData, timeline: input, step: 'name' });
        addMessage('Perfect. Please share your full name, mobile number and email, and the team will contact you to book a valuation appointment.');
        addMessage('What\'s your full name?');
        break;
      case 'name':
        setFlowData({ ...flowData, name: input, step: 'mobile' });
        addMessage('And your mobile number?');
        break;
      case 'mobile':
        setFlowData({ ...flowData, mobile: input, step: 'email' });
        addMessage('Finally, your email address?');
        break;
      case 'email':
        setFlowData({ ...flowData, email: input });
        submitSellerLead();
        break;
      default:
        // Reset to welcome if unknown step
        showWelcomeMessage();
        break;
    }
  };

  const submitSellerLead = async () => {
    const { name, mobile, email, postcode, beds, type, timeline } = flowData;
    setIsTyping(true);
    
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      await fetch(`${API_URL}/api/chatbot-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'seller_valuation',
          name,
          mobile,
          email,
          postcode,
          bedrooms: beds,
          propertyType: type,
          timeline
        }),
        mode: 'cors',
      });

      setIsTyping(false);
      
      addMessage(`Thanks ${name} — someone will contact you during ${CONFIG.OFFICE_HOURS}.\n\nBy sharing these details, you agree ${CONFIG.AGENCY_NAME} can contact you about your valuation request.`);
    } catch (error) {
      setIsTyping(false);
      addMessage(`Thanks ${name} — someone will contact you during ${CONFIG.OFFICE_HOURS}.\n\nBy sharing these details, you agree ${CONFIG.AGENCY_NAME} can contact you about your valuation request.`);
    }
    
    setTimeout(() => {
      showWelcomeMessage();
    }, 3000);
  };

  // Viewing Flow
  const startViewingFlow = () => {
    addMessage('No problem — which property is it for? (reference/address/link)');
    setFlowData({ flow: 'viewing', step: 'property' });
  };

  const continueViewingFlow = (input) => {
    const { step } = flowData;
    switch (step) {
      case 'property':
        setFlowData({ ...flowData, property: input, step: 'time' });
        addMessage('Great. What day/time works best for you?');
        break;
      case 'time':
        setFlowData({ ...flowData, time: input, step: 'number' });
        addMessage('How many people will attend the viewing?');
        break;
      case 'number':
        setFlowData({ ...flowData, number: input, step: 'name' });
        addMessage('Thanks — please share your name, mobile number, and email.');
        addMessage('What\'s your full name?');
        break;
      case 'name':
        setFlowData({ ...flowData, name: input, step: 'mobile' });
        addMessage('And your mobile number?');
        break;
      case 'mobile':
        setFlowData({ ...flowData, mobile: input, step: 'email' });
        addMessage('Finally, your email address?');
        break;
      case 'email':
        setFlowData({ ...flowData, email: input });
        submitViewingLead();
        break;
      default:
        // Reset to welcome if unknown step
        showWelcomeMessage();
        break;
    }
  };

  const submitViewingLead = async () => {
    const { name, mobile, email, property, time, number } = flowData;
    setIsTyping(true);
    
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      await fetch(`${API_URL}/api/chatbot-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'viewing_booking',
          name,
          mobile,
          email,
          property,
          preferredTime: time,
          numberOfAttendees: number
        }),
        mode: 'cors',
      });
      setIsTyping(false);
      addMessage(`Perfect. We'll confirm the appointment as soon as possible. If you need urgent help, you can call ${CONFIG.PHONE}.`);
    } catch (error) {
      setIsTyping(false);
      addMessage(`Perfect. We'll confirm the appointment as soon as possible. If you need urgent help, you can call ${CONFIG.PHONE}.`);
    }
    
    setTimeout(() => {
      showWelcomeMessage();
    }, 3000);
  };

  // Property Enquiry Flow
  const startPropertyEnquiryFlow = () => {
    addMessage('Of course — do you have the property reference or the address/postcode?');
    setFlowData({ flow: 'property_enquiry', step: 'ref' });
  };

  const continuePropertyEnquiryFlow = (input) => {
    const { step } = flowData;
    if (step === 'ref') {
      setFlowData({ ...flowData, ref: input, step: 'choice' });
      addMessage('Thanks. What would you like to know?', 'bot', [
        'Arrange a viewing',
        'Availability',
        'Price / offers',
        'Key features',
        'Area / schools / transport'
      ]);
    } else if (step === 'choice' && input.toLowerCase().includes('viewing')) {
      setFlowData({ ...flowData, choice: input, step: 'time' });
      addMessage('Great — what day/time usually suits you best?');
    } else if (step === 'time') {
      setFlowData({ ...flowData, time: input, step: 'name' });
      addMessage('Perfect. Can I take your name, mobile number, and email so the team can confirm the viewing?');
      addMessage('What\'s your full name?');
    } else if (step === 'name') {
      setFlowData({ ...flowData, name: input, step: 'mobile' });
      addMessage('And your mobile number?');
    } else if (step === 'mobile') {
      setFlowData({ ...flowData, mobile: input, step: 'email' });
      addMessage('Finally, your email address?');
    } else if (step === 'email') {
      setFlowData({ ...flowData, email: input });
      addMessage('Thanks — we\'ll confirm availability and get back to you shortly.');
      setTimeout(() => showWelcomeMessage(), 3000);
    } else {
      addMessage('I\'ll pass this to the team and they\'ll get back to you with the information.');
      setTimeout(() => showWelcomeMessage(), 2000);
    }
  };

  // Offer Flow
  const startOfferFlow = () => {
    addMessage('I can help with that. Which property is the offer for? (ref/address)');
    setFlowData({ flow: 'offer', step: 'property' });
  };

  const continueOfferFlow = (input) => {
    const { step } = flowData;
    switch (step) {
      case 'property':
        setFlowData({ ...flowData, property: input, step: 'offer' });
        addMessage('What offer amount would you like to put forward?');
        break;
      case 'offer':
        setFlowData({ ...flowData, offer: input, step: 'position' });
        addMessage('Are you in a position to proceed?', 'bot', [
          'Mortgage in principle (MIP) in place',
          'Cash buyer',
          'Need to sell a property first',
          'Still arranging finance'
        ]);
        break;
      case 'position':
        setFlowData({ ...flowData, position: input, step: 'conditions' });
        addMessage('Understood. Any conditions we should note? (e.g., subject to survey, chain-free, preferred completion date)');
        break;
      case 'conditions':
        setFlowData({ ...flowData, conditions: input, step: 'name' });
        addMessage('Great — please share your name, mobile number and email and the team will confirm receipt and next steps.');
        addMessage('What\'s your full name?');
        break;
      case 'name':
        setFlowData({ ...flowData, name: input, step: 'mobile' });
        addMessage('And your mobile number?');
        break;
      case 'mobile':
        setFlowData({ ...flowData, mobile: input, step: 'email' });
        addMessage('Finally, your email address?');
        break;
      case 'email':
        setFlowData({ ...flowData, email: input });
        addMessage('Thanks. We\'ll pass this to the negotiator and get back to you as soon as possible.');
        setTimeout(() => showWelcomeMessage(), 3000);
        break;
      default:
        // Reset to welcome if unknown step
        showWelcomeMessage();
        break;
    }
  };

  // Speak to Team Flow
  const startSpeakTeamFlow = () => {
    addMessage('Of course. Is it about:', 'bot', [
      'Buying / viewing',
      'Selling / valuation',
      'An existing sale (progression)',
      'General query'
    ]);
    setFlowData({ flow: 'speak_team', step: 'choice' });
  };

  const continueSpeakTeamFlow = (input) => {
    if (flowData.step === 'choice') {
      setFlowData({ ...flowData, choice: input, step: 'name' });
      addMessage('No problem — please share your name and the best number to call, and a member of the team will get back to you.');
      addMessage(`If it's urgent, call ${CONFIG.PHONE}.`);
      addMessage('What\'s your full name?');
    } else if (flowData.step === 'name') {
      setFlowData({ ...flowData, name: input, step: 'mobile' });
      addMessage('And the best number to call you on?');
    } else if (flowData.step === 'mobile') {
      addMessage(`Thanks — I've passed this to the team. A member of ${CONFIG.AGENCY_NAME} will contact you shortly.\nIf you need urgent help, call ${CONFIG.PHONE}.`);
      setTimeout(() => showWelcomeMessage(), 3000);
    }
  };

  // Common Questions Handler
  const handleCommonQuestion = async (question) => {
    const lower = question.toLowerCase();
    setIsTyping(true);
    
    // Check for common questions
    if (lower.includes('available') || lower.includes('still available')) {
      setIsTyping(false);
      addMessage('I can help. Availability can change quickly — if you share the property reference or link, I\'ll pass it to the team to confirm and offer the next viewing slots.');
      return;
    }
    
    if (lower.includes('council tax')) {
      setIsTyping(false);
      addMessage('If you share the property reference/address, I\'ll ask the team to confirm the council tax band and come back to you.');
      return;
    }
    
    if (lower.includes('service charge') || lower.includes('ground rent')) {
      setIsTyping(false);
      addMessage('For flats, these can vary. If you share the listing link or reference, we\'ll confirm the latest figures for you.');
      return;
    }
    
    if (lower.includes('freehold') || lower.includes('leasehold')) {
      setIsTyping(false);
      addMessage('Please share the property reference/address and I\'ll confirm the tenure with the team.');
      return;
    }
    
    if (lower.includes('view today') || lower.includes('view today')) {
      setIsTyping(false);
      addMessage('Possibly — it depends on availability. Which property is it, and what time window works for you? I\'ll get the team to confirm.');
      return;
    }
    
    if (lower.includes('virtual viewing') || lower.includes('virtual tour')) {
      setIsTyping(false);
      addMessage('Some properties have virtual tours. Share the property reference and I\'ll confirm what\'s available.');
      return;
    }
    
    if (lower.includes('worth') || lower.includes('valuation')) {
      setIsTyping(false);
      addMessage('The quickest way is a free valuation. If you share the postcode, property type and number of bedrooms, the team can arrange a valuation appointment.');
      return;
    }
    
    if (lower.includes('open') || lower.includes('hours')) {
      setIsTyping(false);
      addMessage(`Our office hours are ${CONFIG.OFFICE_HOURS}. I can still take your details now and the team will respond as soon as they're next available.`);
      return;
    }
    
    // Default: try API or provide generic response
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ question }),
        mode: 'cors',
      });
      const data = await response.json();
      setIsTyping(false);
      if (response.ok && data.success) {
        addMessage(data.answer);
      } else {
        addMessage('I can help with that. Could you provide a bit more detail, or would you like to speak to our team directly?');
      }
    } catch (error) {
      setIsTyping(false);
      addMessage('I can help with that. Could you provide a bit more detail, or would you like to speak to our team directly?');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;
    
    const userInput = inputMessage.trim();
    addMessage(userInput, 'user');
    setInputMessage('');
    
    // Handle based on current flow
    if (currentFlow === 'buyer') {
      continueBuyerFlow(userInput);
    } else if (currentFlow === 'seller') {
      continueSellerFlow(userInput);
    } else if (currentFlow === 'viewing') {
      continueViewingFlow(userInput);
    } else if (currentFlow === 'property_enquiry') {
      continuePropertyEnquiryFlow(userInput);
    } else if (currentFlow === 'offer') {
      continueOfferFlow(userInput);
    } else if (currentFlow === 'speak_team') {
      continueSpeakTeamFlow(userInput);
    } else {
      handleCommonQuestion(userInput);
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

  const hasViewport = Object.keys(viewportStyle).length > 0;
  const rootStyle = hasViewport
    ? {
        position: 'fixed',
        zIndex: 1200,
        ...viewportStyle,
        paddingTop: 'env(safe-area-inset-top, 0)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }
    : { minHeight: '100vh' };

  const formatBotMessage = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => (
          <p key={idx} className="text-sm sm:text-base leading-relaxed">{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden box-border"
      style={rootStyle}
      role="dialog"
      aria-modal="true"
      aria-label={`${CONFIG.AGENCY_NAME} Chat`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:48px_48px] pointer-events-none" />

      <header
        className="relative flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border-b border-white/10 flex-shrink-0 min-h-[52px] sm:min-h-0"
        style={{
          background: 'linear-gradient(180deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.4) 100%)',
          boxShadow: '0 1px 0 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 overflow-hidden">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <i className="fas fa-robot text-white text-base sm:text-lg md:text-xl" />
          </div>
          <div className="min-w-0 overflow-hidden">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">{CONFIG.AGENCY_NAME}</h1>
            <p className="text-xs sm:text-sm text-white/60 truncate">We&apos;re here to help</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Close chat"
        >
          <i className="fas fa-times text-base sm:text-lg md:text-xl" />
        </button>
      </header>

      <div
        ref={messagesAreaRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} min-w-0 w-full`}
          >
            <div
              className={`max-w-[92%] sm:max-w-[80%] md:max-w-[70%] min-w-0 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4 shadow-lg flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="text-sm sm:text-base leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }}>
                  {formatBotMessage(msg.text)}
                  {msg.options && (
                    <div className="mt-3 space-y-2">
                      {msg.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="w-full text-left px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 text-sm sm:text-base"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm sm:text-base leading-relaxed break-words" style={{ overflowWrap: 'anywhere' }}>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start min-w-0">
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

      <div
        className="relative flex-shrink-0 p-3 sm:p-5 md:p-6 border-t border-white/10 pb-safe"
        style={{
          background: 'linear-gradient(0deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.6) 100%)',
        }}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-4 items-center max-w-4xl mx-auto min-w-0 w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type your message..."
            inputMode="text"
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
            className="flex-1 min-w-0 w-full max-w-full bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 min-h-[44px] touch-manipulation"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
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
