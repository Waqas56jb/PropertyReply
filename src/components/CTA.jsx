import React from 'react';

const CTA = () => {
  const handleDemoClick = (e) => {
    e.preventDefault();
    if (window.openDemoModal) {
      window.openDemoModal();
    }
  };

  const handleTrialClick = (e) => {
    e.preventDefault();
    if (window.openChatbox) {
      window.openChatbox();
    }
  };

  return (
    <section className="py-32 px-[5%] relative max-md:py-16 max-md:px-4">
      <div className="bg-gradient-primary text-white py-24 px-[5%] rounded-3xl text-center max-w-container mx-auto relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80')] before:bg-cover before:bg-center before:opacity-10" data-aos="zoom-in">
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 relative max-md:text-[2.5rem] max-sm:text-[2rem]">
          Ready to Transform Your Lead Generation?
        </h2>
        <p className="text-lg opacity-90 max-w-[700px] mx-auto mb-12 relative max-md:text-base">
          Join hundreds of UK estate agencies using PropertyReply to capture more qualified leads, respond instantly to enquiries, and grow their business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-stretch sm:items-center relative max-w-full">
          <button onClick={handleTrialClick} className="w-full sm:w-auto px-6 sm:px-8 md:px-11 py-3 sm:py-3.5 md:py-4.5 rounded-full font-semibold text-sm sm:text-base md:text-lg cursor-pointer transition-all duration-300 border-none font-sans relative overflow-hidden inline-flex items-center justify-center gap-2 sm:gap-3 tracking-wide bg-gradient-accent text-white shadow-md hover:-translate-y-1 hover:shadow-lg">
            <i className="fas fa-rocket text-sm sm:text-base md:text-[1.1rem] text-white"></i>
            Start Free Trial
          </button>
          <button onClick={handleDemoClick} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base cursor-pointer transition-all duration-300 border-none font-sans relative overflow-hidden inline-flex items-center justify-center gap-2 sm:gap-3 tracking-wide bg-gradient-dark text-white shadow-md hover:-translate-y-1 hover:shadow-lg">
            <i className="fas fa-calendar-check text-sm sm:text-base md:text-[1.1rem] text-white"></i>
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

