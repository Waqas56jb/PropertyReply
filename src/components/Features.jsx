import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fa-shield-alt',
      title: 'GDPR Compliant',
      description: 'Full compliance with UK data protection regulations and privacy laws.',
      delay: 100
    },
    {
      icon: 'fa-landmark',
      title: 'UK Market Focus',
      description: 'Specifically trained on UK property market terminology and processes.',
      delay: 200
    },
    {
      icon: 'fa-sync',
      title: 'CRM Integration',
      description: 'Seamless integration with popular UK estate agency CRM systems.',
      delay: 300
    },
    {
      icon: 'fa-chart-line',
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and insights on lead quality and conversion rates.',
      delay: 400
    }
  ];

  return (
    <section id="features" className="py-32 px-[5%] relative bg-gradient-dark text-white max-md:py-16 max-md:px-4">
      <div className="text-center max-w-[800px] mx-auto mb-20 max-md:mb-12" data-aos="fade-up">
        <div className="inline-block bg-white/10 text-white py-2 px-5 rounded-full text-sm font-semibold mb-4 border border-white/20">
          Advanced Features
        </div>
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 text-white max-md:text-[2.5rem] max-sm:text-[2rem]">
          Enterprise-Grade Technology for UK Estate Agents
        </h2>
        <p className="text-lg text-white/80 leading-[1.8] max-md:text-base">
          Built with cutting-edge AI technology specifically designed for the UK property market and fully compliant with UK regulations.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-20 items-center max-w-container mx-auto max-lg:grid-cols-1 max-lg:gap-12" data-aos="fade-up">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80" 
            alt="PropertyReply Dashboard" 
            className="w-full rounded-3xl shadow-2xl"
          />
        </div>
        
        <div className="flex flex-col gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6 items-start" data-aos="fade-left" data-aos-delay={feature.delay}>
              <div className="flex-shrink-0 w-[70px] h-[70px] bg-primary/25 border-2 border-primary/40 rounded-2xl flex items-center justify-center text-primary-light text-[1.75rem] shadow-[0_4px_15px_rgba(37,99,235,0.2)]">
                <i className={`fas ${feature.icon} text-[#60A5FA] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-display text-xl font-bold mb-2 text-white">{feature.title}</h4>
                <p className="text-white/90 leading-[1.7]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

