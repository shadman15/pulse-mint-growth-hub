import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    service: '',
    otherService: '',
    selectedDate: '',
    selectedTime: ''
  });

  // Sample available dates and times (in real implementation, this would come from Cal.com API)
  const availableDates = [
    '2025-06-02',
    '2025-06-03',
    '2025-06-04',
    '2025-06-05',
    '2025-06-09',
    '2025-06-10'
  ];

  const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
  ];

  useEffect(() => {
    const animateTexts = () => {
      // Show PULSE
      setCurrentText('PULSE');
      setIsVisible(true);
      
      // Hide PULSE after 2 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      
      // Show MINT after 3 seconds total
      setTimeout(() => {
        setCurrentText('MINT');
        setIsVisible(true);
      }, 3000);
      
      // Hide MINT after 5 seconds total
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Start initial animation
    const initialTimer = setTimeout(animateTexts, 500);
    
    // Set up continuous loop every 6 seconds
    const interval = setInterval(animateTexts, 6000);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.businessType || !formData.service || !formData.selectedDate || !formData.selectedTime) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (formData.service === 'other' && !formData.otherService) {
      alert('Please describe your specific needs.');
      return;
    }
    
    // Here you would integrate with Cal.com API or your booking system
    console.log('Booking data:', formData);
    alert('Thank you! Your booking request has been submitted. We will confirm your appointment shortly.');
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-black text-white relative font-light">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-emerald-900/20"></div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Header */}
        <header className="relative z-20 flex justify-between items-center p-8">
          <div 
            className="text-2xl font-light tracking-wider cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={() => setShowBookingForm(false)}
          >
            PULSEMINT
          </div>
          <Button 
            onClick={() => setShowBookingForm(false)}
            className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white"
          >
            ← BACK
          </Button>
        </header>

        {/* Booking Form */}
        <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light tracking-[0.3em] text-white mb-4">
                BOOK A CALL
              </h1>
              <p className="text-white/70 text-lg">
                Let's discuss how we can transform your business
              </p>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white/80 text-sm tracking-wider mb-2">NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/80 text-sm tracking-wider mb-2">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-white/80 text-sm tracking-wider mb-2">BUSINESS TYPE</label>
                <input
                  type="text"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="What Business You Are Currently In?"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-white/80 text-sm tracking-wider mb-2">WHAT SERVICE YOU ARE LOOKING FOR</label>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                >
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                >
                  <option value="">Select a service</option>
                  <option value="chatbot-building">Chatbot Building</option>
                  <option value="ai-appointment-setting">AI Appointment Setting</option>
                  <option value="ai-calling-agent">AI Calling Agent</option>
                  <option value="website-building">Website Building</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Other Service Details */}
              {formData.service === 'other' && (
                <div>
                  <label className="block text-white/80 text-sm tracking-wider mb-2">SPECIFIC NEEDS</label>
                  <textarea
                    value={formData.otherService}
                    onChange={(e) => handleInputChange('otherService', e.target.value)}
                    maxLength={1000}
                    rows={4}
                    className="w-full bg-transparent border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                    placeholder="Please describe your specific needs (max 1000 characters)"
                  />
                  <div className="text-white/40 text-xs mt-1">
                    {formData.otherService.length}/1000 characters
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm tracking-wider mb-2">SELECT DATE</label>
                  <select
                    required
                    value={formData.selectedDate}
                    onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                  >
                    <option value="">Choose a date</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm tracking-wider mb-2">SELECT TIME</label>
                  <select
                    required
                    value={formData.selectedTime}
                    onChange={(e) => handleInputChange('selectedTime', e.target.value)}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                    disabled={!formData.selectedDate}
                  >
                    <option value="">Choose a time</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>
                        {time} (30 min)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button with Animation */}
              <div className="pt-8 text-center">
                <div className="relative inline-block">
                  {/* Animated glow ring around button */}
                  <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 blur-lg animate-pulse"></div>
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-400/50 via-white/30 to-emerald-400/50 blur animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  
                  <Button
                    onClick={handleFormSubmit}
                    className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-12 py-4 text-lg tracking-wider transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    BOOK A CALL
                  </Button>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  We'll confirm your appointment within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-light">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-8">
        <div className="text-2xl font-light tracking-wider">PULSEMINT</div>
        <nav className="flex gap-8">
          <Button 
            onClick={() => scrollToSection('services')}
            className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white"
          >
            [ SERVICES ]
          </Button>
          <div className="relative inline-block">
            {/* Animated glow ring around button */}
            <div className="absolute -inset-1 rounded bg-gradient-to-r from-emerald-500/20 via-white/10 to-emerald-500/20 blur animate-pulse"></div>
            <div className="absolute -inset-0.5 rounded bg-gradient-to-r from-emerald-400/30 via-white/15 to-emerald-400/30 blur-sm animate-pulse" style={{animationDelay: '0.3s'}}></div>
            
            <Button 
              onClick={() => setShowBookingForm(true)}
              className="relative bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 hover:from-emerald-500 hover:to-emerald-400 text-white px-4 py-2 text-sm tracking-wider transition-all duration-300 transform hover:scale-105 border-0"
            >
              BOOK A CALL
            </Button>
          </div>
        </nav>
      </header>

      {/* Main hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div 
          className="relative flex items-center justify-center"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Product labels */}
          <div className="absolute -left-48 top-1/2 -translate-y-1/2">
            <div 
              className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => scrollToSection('services')}
            >
              AUTOMATION
            </div>
          </div>
          
          <div className="absolute -right-48 top-1/2 -translate-y-1/2">
            <div 
              className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => scrollToSection('services')}
            >
              MARKETING
            </div>
          </div>

          {/* Top labels */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2">
            <div className="text-sm tracking-[0.4em] text-white/60 font-light">
              INTELLIGENT
            </div>
          </div>

          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <div className="text-sm tracking-[0.4em] text-white/60 font-light">
              WORKFLOWS
            </div>
          </div>

          {/* Main glowing ring */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Outer glow rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-white/40 to-emerald-500/30 animate-pulse blur-xl"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-emerald-400/50 via-white/60 to-emerald-400/50 blur-lg"></div>
            
            {/* Main ring structure */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-emerald-500 via-white to-emerald-500 p-1 glow-ring">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-900/90 via-black to-emerald-900/90 backdrop-blur-sm flex items-center justify-center">
                {/* Inner content with animated text */}
                <div className="text-center">
                  <div 
                    className={`text-3xl font-light tracking-[0.4em] text-white transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {currentText}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional glow effects */}
            <div className="absolute inset-0 rounded-full bg-gradient-conic from-emerald-500 via-white via-emerald-500 via-white to-emerald-500 opacity-20 animate-spin" style={{animationDuration: '20s'}}></div>
            
            {/* Pulsing inner glow */}
            <div className="absolute inset-8 rounded-full bg-white/5 animate-pulse" style={{animationDuration: '3s'}}></div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20 px-8 bg-gradient-to-br from-purple-900/10 via-black to-emerald-900/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light tracking-[0.3em] text-center text-white mb-16">
            [ SERVICES ]
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-all duration-300">
              <h3 className="text-xl font-light tracking-wider text-white mb-4">AI AUTOMATION</h3>
              <p className="text-white/70 leading-relaxed">Automate workflows, lead follow-up, and content generation using custom AI tools.</p>
            </div>
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-all duration-300">
              <h3 className="text-xl font-light tracking-wider text-white mb-4">DIGITAL MARKETING</h3>
              <p className="text-white/70 leading-relaxed">Campaigns powered by data, not guesswork — SEO, paid ads, and email automation.</p>
            </div>
            <div className="border border-white/20 p-8 hover:bg-white/5 transition-all duration-300">
              <h3 className="text-xl font-light tracking-wider text-white mb-4">WORKFLOW SYSTEMS</h3>
              <p className="text-white/70 leading-relaxed">Build backend systems that scale — from CRMs to full customer journeys.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-8 bg-gradient-to-br from-emerald-900/10 via-black to-purple-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light tracking-[0.3em] text-white mb-8">
            [ GET STARTED ]
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Ready to transform your business with AI automation and smart marketing?
          </p>
          
          {/* Animated Book a Call Button */}
          <div className="relative inline-block">
            {/* Animated glow ring around button */}
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 blur-lg animate-pulse"></div>
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-400/50 via-white/30 to-emerald-400/50 blur animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            <Button 
              onClick={() => setShowBookingForm(true)}
              className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 py-3 text-sm tracking-wider transition-all duration-300 transform hover:scale-105 border-0"
            >
              BOOK A CALL
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 p-8">
        <div className="text-center">
          <div className="text-xs tracking-wider text-white/40 mb-2">
            PULSEMINT [C] 2024. ALL RIGHTS RESERVED.
          </div>
          <div className="text-xs tracking-wider text-white/30">
            AI AUTOMATION & DIGITAL MARKETING SOLUTIONS
          </div>
        </div>
      </footer>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5),
                        0 0 40px rgba(16, 185, 129, 0.3),
                        0 0 60px rgba(16, 185, 129, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.8),
                        0 0 60px rgba(16, 185, 129, 0.5),
                        0 0 90px rgba(16, 185, 129, 0.3);
          }
        }
        
        .glow-ring {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;