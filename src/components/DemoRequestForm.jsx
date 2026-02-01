import React, { useState } from 'react';

const DemoRequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    numberOfProperties: '',
    currentSystem: '',
    preferredTime: '',
    requirements: '',
    position: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'https://property-reply-backend.vercel.app').replace(/\/$/, '');
      const apiEndpoint = `${API_URL}/api/demo-request`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'demo_request'
        }),
        mode: 'cors',
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      if (response.ok && data.success) {
        setSubmitStatus('success');
        if (onSubmit) {
          onSubmit(formData);
        }
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            agencyName: '',
            contactName: '',
            email: '',
            phone: '',
            numberOfProperties: '',
            currentSystem: '',
            preferredTime: '',
            requirements: '',
            position: ''
          });
          setCurrentStep(1);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.agencyName.trim() && formData.contactName.trim();
      case 2:
        return formData.email.trim() && formData.phone.trim();
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-gradient-primary text-white shadow-primary'
                    : 'bg-white/10 text-white/50 border border-white/20'
                }`}
              >
                {currentStep > step ? <i className="fas fa-check"></i> : step}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${
                currentStep >= step ? 'text-white' : 'text-white/50'
              }`}>
                {step === 1 ? 'Agency Info' : step === 2 ? 'Contact Details' : 'Requirements'}
              </span>
            </div>
            {step < 3 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                currentStep > step ? 'bg-gradient-primary' : 'bg-white/10'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Agency Information */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <label htmlFor="agencyName" className="block text-white font-semibold mb-2">
              Agency Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="agencyName"
              name="agencyName"
              required
              value={formData.agencyName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Your estate agency name"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-white font-semibold mb-2">
              Your Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-white font-semibold mb-2">
              Your Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="e.g., Director, Manager, Owner"
            />
          </div>
        </div>
      )}

      {/* Step 2: Contact Details */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-2">
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="your.email@agency.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-white font-semibold mb-2">
              Mobile Number <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="+44 1234 567890"
            />
          </div>
        </div>
      )}

      {/* Step 3: Requirements */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <label htmlFor="numberOfProperties" className="block text-white font-semibold mb-2">
              Number of Properties (approx.)
            </label>
            <select
              id="numberOfProperties"
              name="numberOfProperties"
              value={formData.numberOfProperties}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="" className="bg-dark">Select range</option>
              <option value="1-50" className="bg-dark">1-50 properties</option>
              <option value="51-100" className="bg-dark">51-100 properties</option>
              <option value="101-250" className="bg-dark">101-250 properties</option>
              <option value="251-500" className="bg-dark">251-500 properties</option>
              <option value="500+" className="bg-dark">500+ properties</option>
            </select>
          </div>

          <div>
            <label htmlFor="currentSystem" className="block text-white font-semibold mb-2">
              Current System / CRM
            </label>
            <input
              type="text"
              id="currentSystem"
              name="currentSystem"
              value={formData.currentSystem}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="e.g., Reapit, Dezrez, Vebra, Custom"
            />
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-white font-semibold mb-2">
              Preferred Demo Time
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="" className="bg-dark">Select preference</option>
              <option value="morning" className="bg-dark">Morning (9am-12pm)</option>
              <option value="afternoon" className="bg-dark">Afternoon (12pm-5pm)</option>
              <option value="evening" className="bg-dark">Evening (5pm-8pm)</option>
              <option value="flexible" className="bg-dark">Flexible</option>
            </select>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-white font-semibold mb-2">
              Specific Requirements or Questions
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows="4"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Tell us about your specific needs, questions, or what you'd like to see in the demo..."
            />
          </div>
        </div>
      )}

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-xl">
          <i className="fas fa-check-circle mr-2"></i>
          Thank you! Your demo request has been submitted. We'll contact you within 24 hours to schedule your demo.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl">
          <div className="flex items-start gap-2">
            <i className="fas fa-exclamation-circle mt-1"></i>
            <div>
              <p className="font-semibold">Something went wrong.</p>
              <p className="text-sm mt-1">Please check your internet connection and try again, or email us directly at Propertyreply1@gmail.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </button>
        )}
        <div className="flex-1"></div>
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-primary shadow-primary hover:shadow-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-primary shadow-primary hover:shadow-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Submit Demo Request
              </>
            )}
          </button>
        )}
      </div>

      {/* Privacy Notice */}
      <p className="text-xs text-white/50 text-center mt-4">
        By submitting this form, you agree that PropertyReply can contact you about your demo request.
      </p>
    </form>
  );
};

export default DemoRequestForm;
