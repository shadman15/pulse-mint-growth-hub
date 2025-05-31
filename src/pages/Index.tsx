import React, { useState, useEffect } from 'react';

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
    customNeeds: '',
    selectedDate: '',
    selectedTime: ''
  });

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you soon.');
    setShowBookingForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const availableDates = [
    { date: '2025-06-02', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
    { date: '2025-06-03', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { date: '2025-06-04', slots: ['10:00 AM', '1:00 PM', '5:00 PM'] },
    { date: '2025-06-05', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-light">
      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900/95 via-black/95 to-emerald-900/95 border border-emerald-500/30 rounded-lg p-8 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition-colors"
            >
              ×
            </button>
            
            <h2 className="text-3xl font-light tracking-[0.2em] text-white mb-8 text-center">
              BOOK A CALL
            </h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm tracking-wider text-white/80 mb-2">NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm tracking-wider text-white/80 mb-2">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
              
              {/* Business Type */}
              <div>
                <label className="block text-sm tracking-wider text-white/80 mb-2">BUSINESS TYPE</label>
                <input
                  type="text"
                  required
                  placeholder="What Business You Are Currently In?"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/40 focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
              
              {/* Service Selection */}
              <div>
                <label className="block text-sm tracking-wider text-white/80 mb-2">WHAT SERVICE YOU ARE LOOKING FOR</label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                >
                  <option value="">Select a service...</option>
                  <option value="chatbot">Chatbot Building</option>
                  <option value="appointment">AI Appointment Setting</option>
                  <option value="calling">AI Calling Agent</option>
                  <option value="website">Website Building</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Custom Needs - Show when "Other" is selected */}
              {formData.service === 'other' && (
                <div>
                  <label className="block text-sm tracking-wider text-white/80 mb-2">SPECIFIC NEEDS</label>
                  <textarea
                    maxLength={1000}
                    value={formData.customNeeds}
                    onChange={(e) => handleInputChange('customNeeds', e.target.value)}
                    placeholder="Describe your specific needs (max 1000 characters)"
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-white/40 focus:border-emerald-500/50 focus:outline-none transition-colors h-32 resize-none"
                  />
                  <div className="text-xs text-white/40 text-right mt-1">
                    {formData.customNeeds.length}/1000
                  </div>
                </div>
              )}
              
              {/* Date Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm tracking-wider text-white/80 mb-2">SELECT DATE</label>
                  <select
                    required
                    value={formData.selectedDate}
                    onChange={(e) => {
                      handleInputChange('selectedDate', e.target.value);
                      handleInputChange('selectedTime', ''); // Reset time when date changes
                    }}
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                  >
                    <option value="">Choose date...</option>
                    {availableDates.map((dateOption) => (
                      <option key={dateOption.date} value={dateOption.date}>
                        {new Date(dateOption.date).toLocaleDateString('en-US', { 
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
                  <label className="block text-sm tracking-wider text-white/80 mb-2">SELECT TIME (30 MINS)</label>
                  <select
                    required
                    value={formData.selectedTime}
                    onChange={(e) => handleInputChange('selectedTime', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-colors"
                    disabled={!formData.selectedDate}
                  >
                    <option value="">Choose time...</option>
                    {formData.selectedDate && 
                      availableDates
                        .find(d => d.date === formData.selectedDate)
                        ?.slots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))
                    }
                  </select>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleFormSubmit}
                  className="w-full text-sm tracking-wider border border-emerald-500/50 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300 text-white relative overflow-hidden group rounded"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">CONFIRM BOOKING</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <button 
            onClick={() => scrollToSection('services')}
            className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded"
          >
            [ SERVICES ]
          </button>
          <button 
            onClick={() => setShowBookingForm(true)}
            className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded"
          >
            BOOK A CALL
          </button>
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
              In
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
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-emerald-500 via-white to-emerald-500 p-1" style={{
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)',
              animation: 'pulse 3s ease-in-out infinite'
            }}>
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
          <button 
            onClick={() => setShowBookingForm(true)}
            className="relative text-sm tracking-wider border border-emerald-500/50 px-8 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300 text-white overflow-hidden group animate-pulse rounded"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-white/20 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <span className="relative z-10">BOOK A CALL</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 p-8 mt-20">
        <div className="text-center">
          <div className="text-xs tracking-wider text-white/40 mb-2">
            PULSEMINT [C] 2024. ALL RIGHTS RESERVED.
          </div>
          <div className="text-xs tracking-wider text-white/30">
            AI AUTOMATION & DIGITAL MARKETING SOLUTIONS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;