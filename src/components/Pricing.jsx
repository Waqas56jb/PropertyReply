import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '£99',
      period: '/mo',
      description: 'Great for your first live enquiries.',
      setup: '£249 one-time setup',
      featured: false,
      features: [
        { text: 'Reply to every enquiry instantly', included: true },
        { text: 'Filter serious buyers & sellers fast', included: true },
        { text: 'Book valuations & viewings automatically', included: true },
        { text: 'Email alerts with full lead context', included: true },
        { text: 'GDPR-ready for UK agents', included: true }
      ],
      buttonText: 'Request a Demo',
      buttonClass: 'btn-secondary',
      delay: 100
    },
    {
      name: 'Pro',
      price: '£149',
      period: '/mo',
      description: 'For agencies wanting more automation.',
      setup: '£249 one-time setup',
      featured: true,
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Calendar-sync for viewings & valuations', included: true },
        { text: 'SMS + email alerts with next-best-action', included: true },
        { text: 'Lead summaries & export', included: true },
        { text: 'Priority support', included: true }
      ],
      buttonText: 'Request a Demo',
      buttonClass: 'btn-primary',
      delay: 200
    }
  ];

  return (
    <section id="pricing" className="py-32 px-[5%] relative bg-gradient-dark text-white max-md:py-16 max-md:px-4">
      <div className="text-center max-w-[800px] mx-auto mb-20 max-md:mb-12" data-aos="fade-up">
        <div className="inline-block bg-primary/20 text-white py-2 px-5 rounded-full text-sm font-semibold mb-4 border border-primary/40">
          Simple Pricing
        </div>
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 text-white max-md:text-[2.5rem] max-sm:text-[2rem]">
          Choose the plan that fits today
        </h2>
        <p className="text-lg text-white/80 leading-[1.8] max-md:text-base">
          Clear pricing for UK estate agents. £249 one-time setup. No hidden fees.
        </p>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8 max-w-container mx-auto max-lg:grid-cols-1 max-lg:max-w-[500px]">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`bg-dark-light/80 rounded-3xl p-12 shadow-lg transition-all duration-300 border-2 border-white/10 relative overflow-hidden hover:-translate-y-2.5 hover:shadow-xl max-sm:p-8 ${plan.featured ? 'border-primary scale-105 max-lg:scale-100' : ''}`}
            data-aos="fade-up" 
            data-aos-delay={plan.delay}
          >
            {plan.featured && (
              <div className="absolute top-5 -right-9 bg-gradient-primary text-white py-2 px-12 text-sm font-semibold rotate-45">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <p className="text-white/75 mb-3">{plan.setup}</p>
              <div className="font-display text-[3.2rem] font-extrabold text-primary-light leading-none">
                {plan.price}
                <span className="text-base text-white/70 font-medium">{plan.period}</span>
              </div>
              <p className="mt-4 text-white/70">{plan.description}</p>
            </div>
            
            <ul className="list-none my-10">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="py-3 border-b border-white/10 flex items-center gap-3 text-white/90 last:border-b-0">
                  <i className={`fas ${feature.included ? 'fa-check text-success text-[1.1rem]' : 'fa-times text-white/30'}`}></i>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full px-8 py-3.5 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 border-none font-sans relative overflow-hidden inline-flex items-center justify-center gap-3 tracking-wide ${
              plan.buttonClass === 'btn-primary' 
                ? 'bg-gradient-primary text-white shadow-primary hover:-translate-y-0.5 hover:shadow-primary-hover' 
                : 'bg-white/10 text-white border-2 border-white/30 backdrop-blur-[10px] hover:bg-white/15 hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
            }`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;

