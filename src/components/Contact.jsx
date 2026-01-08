import React from 'react';
import ContactForm from './ContactForm';

const Contact = () => {
  const contactItems = [
    {
      icon: 'fa-envelope',
      title: 'Email',
      content: 'info@propertyreply.com'
    },
    {
      icon: 'fa-phone',
      title: 'Phone',
      content: '+447878938733'
    },
    {
      icon: 'fa-globe',
      title: 'Website',
      content: 'Visit Website',
      url: 'https://www.propertyreply.com/',
      isIconClickable: true
    },
    {
      icon: 'fa-map-marker-alt',
      title: 'Location',
      content: 'United Kingdom'
    },
    {
      icon: 'fa-clock',
      title: 'Response Time',
      content: 'Within 24 hours'
    },
    {
      icon: 'fa-business-time',
      title: 'Business Hours',
      content: '10:00AM-20:00PM Monday-Sunday'
    }
  ];

  return (
    <section id="contact" className="py-32 px-[5%] relative bg-gradient-dark text-white max-md:py-16 max-md:px-4">
      <div className="text-center max-w-[800px] mx-auto mb-20 max-md:mb-12" data-aos="fade-up">
        <div className="inline-block bg-primary/20 text-white py-2 px-5 rounded-full text-sm font-semibold mb-4 border border-primary/40">
          Contact Us
        </div>
        <h2 className="font-display text-5xl font-extrabold leading-[1.1] mb-6 text-white max-md:text-[2.5rem] max-sm:text-[2rem]">
          Get in Touch
        </h2>
        <p className="text-lg text-white/80 leading-[1.8] max-md:text-base">
          Have questions? Our team is here to help you get started with PropertyReply.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-20 items-start max-w-container mx-auto max-lg:grid-cols-1 max-lg:gap-12" data-aos="fade-up">
        <div className="flex flex-col gap-8">
          {contactItems.map((item, index) => (
            <div key={index} className="flex gap-6 items-start">
              {item.isIconClickable ? (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-[70px] h-[70px] bg-primary/25 border-2 border-primary/40 rounded-2xl flex items-center justify-center text-primary-light text-[1.75rem] shadow-[0_4px_15px_rgba(37,99,235,0.2)] hover:bg-primary/35 hover:border-primary/60 hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <i className={`fas ${item.icon} text-[#60A5FA] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}></i>
                </a>
              ) : (
                <div className="flex-shrink-0 w-[70px] h-[70px] bg-primary/25 border-2 border-primary/40 rounded-2xl flex items-center justify-center text-primary-light text-[1.75rem] shadow-[0_4px_15px_rgba(37,99,235,0.2)]">
                  <i className={`fas ${item.icon} text-[#60A5FA] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}></i>
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-display text-xl font-bold mb-2 text-white">{item.title}</h4>
                {item.isLink ? (
                  <a 
                    href={item.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/90 leading-[1.7] hover:text-primary-light transition-colors underline"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-white/90 leading-[1.7]">{item.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-dark-light/80 rounded-3xl p-8 border border-white/10">
          <h3 className="font-display text-2xl font-bold mb-6 text-white">Send us a message</h3>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;

