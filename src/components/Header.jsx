import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setActiveLink(targetId);
    setMobileMenuOpen(false);
    
    const targetElement = document.querySelector(`#${targetId}`);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleCTAClick = (e) => {
    e.preventDefault();
    handleNavClick(e, 'contact');
  };

  return (
    <header className={`fixed top-0 left-0 w-full py-4 px-[5%] flex justify-between items-center bg-dark/90 backdrop-blur-[20px] z-[1000] border-b border-white/10 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.4)] ${scrolled ? 'py-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)] bg-dark-light/95' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="h-[65px] w-auto flex items-center justify-center">
          <img src="/logo.png" alt="PropertyReply Logo" className="h-full w-auto object-contain" />
        </div>
      </div>
      
      <nav>
        <ul className={`flex gap-10 items-center list-none max-lg:fixed max-lg:top-[70px] max-lg:left-0 max-lg:w-full max-lg:bg-dark max-lg:flex-col max-lg:p-8 max-lg:shadow-[0_10px_30px_rgba(0,0,0,0.6)] max-lg:transition-all max-lg:duration-300 max-lg:z-[999] max-lg:gap-6 ${mobileMenuOpen ? 'max-lg:translate-y-0 max-lg:opacity-100 max-lg:visible' : 'max-lg:-translate-y-full max-lg:opacity-0 max-lg:invisible'}`}>
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'home' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'home' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Home</a></li>
          <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'services' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'services' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Services</a></li>
          <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'features' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'features' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Features</a></li>
          <li><a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'pricing' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'pricing' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Pricing</a></li>
          <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'testimonials' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'testimonials' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Testimonials</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`text-white font-medium text-base relative py-2 transition-colors duration-200 ${activeLink === 'contact' ? 'text-primary-light' : ''} after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 ${activeLink === 'contact' ? 'after:w-full' : 'after:w-0 hover:after:w-full'} hover:text-primary-light`}>Contact</a></li>
        </ul>
      </nav>

      <div className="flex gap-3 items-center">
        <button onClick={handleCTAClick} className="px-8 py-3.5 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 border-none font-sans relative overflow-hidden inline-flex items-center justify-center gap-3 tracking-wide bg-gradient-primary text-white shadow-primary hover:-translate-y-0.5 hover:shadow-primary-hover max-lg:px-7 max-lg:py-3 max-lg:text-[0.95rem]">
          <i className="fas fa-calendar-check text-[1.1rem]"></i>
          Request a Demo
        </button>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="hidden max-lg:block bg-transparent border-none text-[1.5rem] text-white cursor-pointer p-2 rounded-lg transition-colors duration-200 z-[1001] hover:bg-white/10">
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-white`}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

