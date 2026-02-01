import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ParticlesBackground from './components/ParticlesBackground';
import Chatbox from './components/Chatbox';
import ChatButton from './components/ChatButton';
import DemoModal from './components/DemoModal';
import DemoRequestModal from './components/DemoRequestModal';
import FullscreenChatbot from './components/FullscreenChatbot';
import { getDemoVideoUrl } from './utils/demoVideoUrl';

function App() {
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoRequestModalOpen, setDemoRequestModalOpen] = useState(false);
  const [fullscreenChatOpen, setFullscreenChatOpen] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');

  // Preload demo video as soon as app mounts so it's cached when user opens modal
  useEffect(() => {
    setDemoVideoUrl(getDemoVideoUrl());
  }, []);

  // Request a Demo / Book a Demo → demo request form modal; openVideoDemo → video modal
  useEffect(() => {
    window.openChatbox = () => setChatboxOpen(true);
    window.openDemoModal = () => setDemoRequestModalOpen(true);
    window.openVideoDemo = () => setDemoModalOpen(true);
    return () => {
      delete window.openChatbox;
      delete window.openDemoModal;
      delete window.openVideoDemo;
    };
  }, []);
  useEffect(() => {
    // Initialize AOS
    if (window.AOS) {
      window.AOS.init({
        duration: 1000,
        once: false,
        mirror: true
      });
    } else {
      // Wait for AOS to load
      const checkAOS = setInterval(() => {
        if (window.AOS) {
          window.AOS.init({
            duration: 1000,
            once: false,
            mirror: true
          });
          clearInterval(checkAOS);
        }
      }, 100);
      
      return () => clearInterval(checkAOS);
    }
  }, []);

  useEffect(() => {
    // Parallax effect on scroll for floating elements
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.floating-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed * 0.1}px) rotate(${scrolled * 0.05}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App w-full max-w-full overflow-x-hidden">
      <Loader />
      <ParticlesBackground />
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      
      <Header />
      <Hero />
      <Services />
      <Features />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
      {!fullscreenChatOpen && (
        <ChatButton onClick={() => setChatboxOpen(true)} isOpen={chatboxOpen} />
      )}
      <Chatbox isOpen={chatboxOpen} onClose={() => setChatboxOpen(false)} />
      {/* Hidden preloader: starts loading demo video on page load so modal plays on first click */}
      {demoVideoUrl && (
        <video
          src={demoVideoUrl}
          preload="auto"
          muted
          playsInline
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        />
      )}
      <FullscreenChatbot isOpen={fullscreenChatOpen} onClose={() => setFullscreenChatOpen(false)} />
      <DemoRequestModal isOpen={demoRequestModalOpen} onClose={() => setDemoRequestModalOpen(false)} />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}

export default App;