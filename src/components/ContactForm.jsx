import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send form data to deployed API
      // Production API: https://property-reply-backend.vercel.app
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, ''); // Remove trailing slash
      const apiEndpoint = `${API_URL}/api/contact`;
      
      // Log for debugging (remove in production if needed)
      console.log('Sending request to:', apiEndpoint);
      console.log('Form data:', { name: formData.name, email: formData.email, hasMessage: !!formData.message });
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors', // Explicitly set CORS mode
      });

      // Check if response is ok before trying to parse JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error('Server error:', data.message || 'Unknown error');
        console.error('Response status:', response.status);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
        console.error('Network error: Unable to connect to the API server');
        console.error('API URL attempted:', `${process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app'}/api/contact`);
        
        // Show more specific error message
        setSubmitStatus('error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-white font-semibold mb-2">
          Name <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-white font-semibold mb-2">
          Email <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-white font-semibold mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="+44 1234 567890"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-white font-semibold mb-2">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows="5"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          placeholder="Tell us about your requirements..."
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-success/20 border border-success/40 text-success px-4 py-3 rounded-xl">
          <i className="fas fa-check-circle mr-2"></i>
          Thank you! Your message has been sent. We'll get back to you within 24 hours.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl">
          <div className="flex items-start gap-2">
            <i className="fas fa-exclamation-circle mt-1"></i>
            <div>
              <p className="font-semibold">Something went wrong.</p>
              <p className="text-sm mt-1">Please check your internet connection and try again, or email us directly at info@propertyreply.com</p>
              <p className="text-xs mt-2 opacity-75">API: property-reply-backend.vercel.app</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Sending...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane mr-2"></i>
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;

