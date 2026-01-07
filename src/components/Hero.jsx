import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [trustedVisible, setTrustedVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const showOnScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = heroRef.current ? heroRef.current.offsetHeight : 0;
      const triggerPoint = heroHeight * 0.3;

      if (scrollPosition > triggerPoint) {
        setTrustedVisible(true);
        setStatsVisible(true);
      }
    };

    window.addEventListener('scroll', showOnScroll);
    showOnScroll(); // Check on initial load

    return () => window.removeEventListener('scroll', showOnScroll);
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleSecondaryClick = (e) => {
    e.preventDefault();
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      window.scrollTo({
        top: featuresSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative overflow-hidden w-full min-h-screen flex items-center justify-center bg-gradient-hero before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[radial-gradient(circle_at_20%_50%,rgba(37,99,235,0.18)_0%,transparent_55%),radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.22)_0%,transparent_55%)] before:z-[1]"
    >
      <div className="max-w-[1200px] relative z-[2] w-full py-32 px-[5%] text-center animate-fadeInUp max-md:py-28 max-md:px-4 max-sm:pt-28 max-sm:pb-20 max-sm:px-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-4 py-1.5 mb-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] mx-auto max-sm:text-[0.7rem] max-sm:px-3 max-sm:py-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-white text-xs shadow-primary">
            <i className="fas fa-bolt"></i>
          </span>
          AI Lead Engine for UK Estate Agents
        </div>

        <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-extrabold leading-[1.05] text-white mb-6 tracking-[-2px] max-md:text-[clamp(2rem,8vw,2.9rem)] max-md:mb-5 max-md:tracking-[-1px] max-sm:text-[clamp(1.7rem,8vw,2.1rem)] max-sm:mb-4 max-sm:tracking-[-0.5px] max-sm:text-center max-sm:leading-[1.2]">
          Never miss another property enquiry{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0">
            <span className="hidden sm:inline">— </span>
            respond instantly
          </span>
        </h1>

        <p className="text-[clamp(1rem,2.3vw,1.3rem)] text-white/85 max-w-[720px] mx-auto mb-10 leading-[1.8] font-normal max-md:text-[clamp(0.95rem,3vw,1.1rem)] max-md:mb-8 max-md:leading-[1.7] max-sm:text-[clamp(1rem,4vw,1.1rem)] max-sm:mb-7 max-sm:leading-[1.65] max-sm:px-4">
          Turn property enquiries into qualified leads and booked viewings — 24/7.
        </p>

        <div className="flex gap-4 items-center justify-center flex-wrap mb-10 max-md:flex-col max-md:items-stretch max-md:gap-4 max-md:w-full max-md:mb-8 max-sm:gap-4 max-sm:mb-7">
          <button
            onClick={handleCTAClick}
            className="px-10 py-4 rounded-full font-semibold text-[0.98rem] cursor-pointer transition-all duration-300 border-none font-sans relative overflow-hidden inline-flex items-center justify-center gap-3 tracking-wide bg-gradient-primary text-white shadow-primary hover:-translate-y-0.5 hover:shadow-primary-hover max-md:w-full max-md:justify-center max-sm:w-full max-sm:py-3.5 max-sm:text-base"
          >
            <i className="fas fa-calendar-check text-[1.1rem] text-white"></i>
            Request a Demo
          </button>
          <button
            onClick={handleSecondaryClick}
            className="px-8 py-3.5 rounded-full font-semibold text-[0.95rem] cursor-pointer transition-all duration-300 border border-white/25 font-sans inline-flex items-center justify-center gap-3 tracking-wide bg-white/5 text-white backdrop-blur-[12px] hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(15,23,42,0.8)] max-md:w-full max-md:justify-center max-sm:w-full max-sm:py-3.5 max-sm:text-base"
          >
            <i className="fas fa-play-circle text-[1.1rem] text-white"></i>
            See It in Action
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-white/60 text-[0.8rem] mb-12 max-sm:flex-col max-sm:gap-3 max-sm:text-center max-sm:mb-8">
          <div className="flex -space-x-2">
            <span className="h-8 w-8 rounded-full border border-dark/80 bg-[url('https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
            <span className="h-8 w-8 rounded-full border border-dark/80 bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
            <span className="h-8 w-8 rounded-full border border-dark/80 bg-[url('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')] bg-cover bg-center" />
          </div>
          <p className="max-sm:text-sm max-sm:px-4">
            Trusted by <span className="font-semibold text-white">leading UK agencies</span> for always-on lead capture.
          </p>
        </div>

        {/* Trusted logos & stats */}
        <div
          className={`mt-4 max-md:mt-6 flex flex-col items-center gap-6 transition-all duration-600 ${
            trustedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center gap-3 text-[0.8rem] text-white/60 uppercase tracking-[0.18em]">
            <span className="h-px w-8 bg-white/20" />
            Trusted by UK estate agents (early adopters)
            <span className="h-px w-8 bg-white/20" />
          </div>
          <div className="flex gap-6 items-center justify-center flex-wrap max-sm:gap-4">
            <div className="h-[clamp(24px,4vw,32px)] w-auto grayscale opacity-70 transition-all duration-300 text-[clamp(1.5rem,3vw,2rem)] hover:grayscale-0 hover:opacity-100 hover:scale-110">
              🏢
            </div>
            <div className="h-[clamp(24px,4vw,32px)] w-auto grayscale opacity-70 transition-all duration-300 text-[clamp(1.5rem,3vw,2rem)] hover:grayscale-0 hover:opacity-100 hover:scale-110">
              🏘️
            </div>
            <div className="h-[clamp(24px,4vw,32px)] w-auto grayscale opacity-70 transition-all duration-300 text-[clamp(1.5rem,3vw,2rem)] hover:grayscale-0 hover:opacity-100 hover:scale-110">
              🏠
            </div>
            <div className="h-[clamp(24px,4vw,32px)] w-auto grayscale opacity-70 transition-all duration-300 text-[clamp(1.5rem,3vw,2rem)] hover:grayscale-0 hover:opacity-100 hover:scale-110">
              🏛️
            </div>
          </div>

          <div
            className={`grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1.25rem,3vw,2rem)] mx-auto pt-8 border-t border-white/10 max-w-[1100px] w-full transition-all duration-600 max-md:grid-cols-2 max-sm:grid-cols-1 ${
              statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {[
              {
                title: 'Reply to leads instantly',
                desc: 'Keep every enquiry warm, even after hours.',
                icon: 'fa-bolt'
              },
              {
                title: 'Turn visitors into viewings',
                desc: 'Book viewings and valuations automatically.',
                icon: 'fa-calendar-check'
              },
              {
                title: 'Qualify buyers & sellers fast',
                desc: 'Filter serious prospects in minutes.',
                icon: 'fa-filter'
              },
              {
                title: 'Built for UK agents',
                desc: 'GDPR-ready and tailored to your workflows.',
                icon: 'fa-shield-alt'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 items-start text-left shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-primary">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="font-display text-[1.3rem] font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white/75 text-[0.95rem] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex flex-col items-center gap-2 absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-[0.75rem]">
          <div className="h-9 w-[1.6px] bg-gradient-to-b from-transparent via-white/60 to-transparent animate-pulse" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

