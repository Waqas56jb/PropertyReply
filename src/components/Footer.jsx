import React, { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }, []);

  const quickLinks = [
    { text: 'Home', href: '#home' },
    { text: 'Services', href: '#services' },
    { text: 'Features', href: '#features' },
    { text: 'Pricing', href: '#pricing' },
    { text: 'Contact', href: '#contact' }
  ];

  const serviceLinks = [
    { text: 'AI Chat Assistant', href: '#' },
    { text: 'Lead Qualification', href: '#' },
    { text: 'Valuation Capture', href: '#' },
    { text: 'Viewing Management', href: '#' },
    { text: 'CRM Integration', href: '#' }
  ];

  const socialLinks = [
    { icon: 'fab fa-linkedin-in', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-instagram', href: '#' }
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="bg-dark text-white py-20 px-[5%] relative">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-16 max-w-container mx-auto mb-16 max-sm:grid-cols-1 max-sm:gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[55px] w-auto flex items-center justify-center">
              <img src="/logo.png" alt="PropertyReply Logo" className="h-full w-auto object-contain" />
            </div>
          </div>
          <p className="text-white/70 mb-6">
            AI-powered chat assistants for UK estate agents, capturing and qualifying leads 24/7.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white no-underline transition-all duration-300 hover:bg-primary hover:-translate-y-1"
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-display text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-primary after:rounded-full">
            Quick Links
          </h3>
          <ul className="list-none">
            {quickLinks.map((link, index) => (
              <li key={index} className="mb-3">
                <a 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-white/70 no-underline transition-colors duration-200 flex items-center gap-2 hover:text-white hover:translate-x-1"
                >
                  <i className="fas fa-chevron-right"></i> {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-display text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-primary after:rounded-full">
            Services
          </h3>
          <ul className="list-none">
            {serviceLinks.map((link, index) => (
              <li key={index} className="mb-3">
                <a 
                  href={link.href} 
                  className="text-white/70 no-underline transition-colors duration-200 flex items-center gap-2 hover:text-white hover:translate-x-1"
                >
                  <i className="fas fa-chevron-right"></i> {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-display text-xl font-bold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gradient-primary after:rounded-full">
            Contact Info
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-white/70">
              <i className="fas fa-envelope text-primary text-lg"></i>
              <span>info@propertyreply.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <i className="fas fa-globe text-primary text-lg"></i>
              <span>propertyreply.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/70">
              <i className="fas fa-map-marker-alt text-primary text-lg"></i>
              <span>United Kingdom</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm max-w-container mx-auto">
        <p>
          &copy; <span id="current-year"></span> PropertyReply. All rights reserved. | UK-Based & GDPR Compliant |{' '}
          <a href="/privacy" className="text-primary no-underline">Privacy Policy</a> |{' '}
          <a href="/terms" className="text-primary no-underline">Terms & Conditions</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

