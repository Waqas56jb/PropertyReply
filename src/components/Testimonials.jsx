import React from 'react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 px-[5%] relative bg-gradient-dark text-white max-md:py-16 max-md:px-4">
      <div className="text-center max-w-[800px] mx-auto mb-20 max-md:mb-12" data-aos="fade-up">
        <div className="inline-block bg-white/10 text-white py-2 px-5 rounded-full text-sm font-semibold mb-4 border border-white/20">
          Early partner feedback
        </div>
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 text-white max-md:text-[2.5rem] max-sm:text-[2rem]">
          Helping UK estate agents respond instantly
        </h2>
        <p className="text-lg text-white/80 leading-[1.8] max-md:text-base">
          Pilot partners see faster replies and warmer enquiries from day one.
        </p>
      </div>

      <div className="max-w-container mx-auto" data-aos="fade-up">
        <div className="bg-dark-light/80 rounded-3xl p-10 shadow-lg border border-white/10 m-4 max-sm:p-8 relative">
          <div className="text-lg leading-[1.8] text-white mb-8 relative">
            <span className="absolute -top-5 -left-3 text-6xl text-primary opacity-20 font-serif">
              &quot;
            </span>
            “We never miss enquiries now. Visitors get an instant response and we book viewings while the office is closed.”
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                alt="Sarah Johnson" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold mb-1 text-white">Sarah Johnson</h4>
              <p className="text-sm text-white/70">Director (pilot), London Property Partners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

