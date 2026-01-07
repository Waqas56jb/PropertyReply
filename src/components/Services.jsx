import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'fa-bolt',
      title: 'Reply to leads instantly — 24/7',
      description: 'Never miss an enquiry. We respond the moment a buyer or seller asks a question on your site.',
      delay: 100
    },
    {
      icon: 'fa-filter',
      title: 'Filter serious buyers & sellers fast',
      description: 'Qualify by budget, timeline, location, and property type so you focus on the right prospects.',
      delay: 200
    },
    {
      icon: 'fa-home',
      title: 'Book valuations & viewings',
      description: 'Capture seller details, schedule valuations, and book viewings automatically.',
      delay: 300
    },
    {
      icon: 'fa-calendar-check',
      title: 'Sync with your calendar',
      description: 'Send confirmations and reminders so appointments stick — no back-and-forth.',
      delay: 400
    },
    {
      icon: 'fa-bell',
      title: 'Instant alerts to your inbox/phone',
      description: 'Get notified with full lead context and next-best-action suggestions.',
      delay: 500
    },
    {
      icon: 'fa-globe',
      title: 'Built for UK estate agents',
      description: 'Language, flows, and compliance aligned to UK agencies out of the box.',
      delay: 600
    }
  ];

  return (
    <section id="services" className="py-32 px-[5%] relative bg-gradient-dark text-white max-md:py-16 max-md:px-4">
      <div className="text-center max-w-[800px] mx-auto mb-20 max-md:mb-12" data-aos="fade-up">
        <div className="inline-block bg-primary/20 text-white py-2 px-5 rounded-full text-sm font-semibold mb-4 border border-primary/40">
          Our Services
        </div>
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 text-white max-md:text-[2.5rem] max-sm:text-[2rem]">
          Complete AI Solution for Modern Estate Agencies
        </h2>
        <p className="text-lg text-white/80 leading-[1.8] max-md:text-base">
          We provide end-to-end AI-powered solutions specifically designed for UK estate agents to capture, qualify, and convert property enquiries efficiently.
        </p>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8 max-w-container mx-auto max-md:grid-cols-1">
        {services.map((service, index) => (
          <div key={index} className="bg-dark-light/80 rounded-3xl p-10 shadow-lg transition-all duration-300 border border-white/10 h-full relative overflow-hidden hover:-translate-y-2.5 hover:shadow-xl max-sm:p-8" data-aos="fade-up" data-aos-delay={service.delay}>
            <div className="w-[70px] h-[70px] bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-[1.75rem] mb-6 shadow-md">
              <i className={`fas ${service.icon} drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}></i>
            </div>
            <h3 className="font-display text-2xl font-bold mb-4 text-white">{service.title}</h3>
            <p className="text-white/80 mb-6">{service.description}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-primary-light font-semibold no-underline transition-all duration-200 hover:gap-3 hover:text-white cursor-pointer bg-transparent border-none p-0"
            >
              Learn More <span className="text-primary-light">→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

