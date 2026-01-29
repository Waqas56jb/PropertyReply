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

function App() {
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Expose functions globally so all components can open chatbox or demo modal
  useEffect(() => {
    window.openChatbox = () => setChatboxOpen(true);
    window.openDemoModal = () => setDemoModalOpen(true);
    return () => {
      delete window.openChatbox;
      delete window.openDemoModal;
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
      <ChatButton onClick={() => setChatboxOpen(true)} isOpen={chatboxOpen} />
      <Chatbox isOpen={chatboxOpen} onClose={() => setChatboxOpen(false)} />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}

export default App;

