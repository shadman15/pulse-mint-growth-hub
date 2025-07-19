import React, { useState, useEffect } from 'react';
import Squares from '@/components/ui/Squares';
import { Bot, Zap, Globe, Clock, CheckCircle, ArrowRight, Star } from 'lucide-react';
import Logo from '../components/Logo';

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
    <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
  {/* Squares background for hero */}
  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
    <Squares
      direction="left"
      speed={1}
      borderColor="#10b981"
      squareSize={40}
      hoverFillColor="#065f46"
    />
  </div>
  <div 
    className="relative flex items-center justify-center z-10"
    style={{
      transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
      transition: 'transform 0.1s ease-out'
    }}
  >
    {/* Main glowing ring and hero content here */}
    {/* Product labels - Hidden on mobile */}
    <div className="absolute -left-48 top-1/2 -translate-y-1/2 hidden lg:block">
      <div 
        className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
        onClick={() => scrollToSection('services')}
      >
        AUTOMATION
      </div>
    </div>
    
    <div className="absolute -right-48 top-1/2 -translate-y-1/2 hidden lg:block">
      <div 
        className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
        onClick={() => scrollToSection('services')}
      >
        MARKETING
      </div>
    </div>

    {/* Top labels - Hidden on mobile */}
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 hidden lg:block">
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
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
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
  <header className="relative z-20 flex justify-between items-center p-4 md:p-8">
    <Logo />
    <nav className="flex gap-3 md:gap-8">
      <button 
        onClick={() => scrollToSection('services')}
        className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded"
      >
        SERVICES
      </button>
      <button 
        onClick={() => scrollToSection('about')}
        className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded"
      >
        ABOUT
      </button>
      <button 
        onClick={() => scrollToSection('contact')}
        className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded"
      >
        CONTACT
      </button>
      <button 
        onClick={() => setShowBookingForm(true)}
        className="text-xs md:text-sm tracking-wider border border-emerald-500/50 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-emerald-500/10 transition-all duration-300 text-white rounded"
      >
        BOOK A CALL
      </button>
    </nav>
  </header>

  {/* Services Section - Hidden by default */}
  <div id="services" className="relative z-10 max-w-6xl mx-auto px-4 py-32 hidden">
    <h2 className="text-4xl font-light tracking-[0.1em] text-white mb-12 text-center">
      OUR SERVICES
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Service Card 1 */}
      <div className="bg-black/50 border border-white/20 rounded-lg p-6 transition-transform transform hover:scale-105 group">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mr-4">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide text-white">
            AI Chatbot Building
          </h3>
        </div>
        <p className="text-white/70 mb-4">
          Create intelligent chatbots that engage your customers 24/7, answer their questions, and drive conversions.
        </p>
        <div className="flex gap-2">
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Automation
          </span>
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Chatbots
          </span>
        </div>
      </div>
      
      {/* Service Card 2 */}
      <div className="bg-black/50 border border-white/20 rounded-lg p-6 transition-transform transform hover:scale-105 group">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mr-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide text-white">
            AI Appointment Setting
          </h3>
        </div>
        <p className="text-white/70 mb-4">
          Let our AI assistants schedule appointments with your clients, reducing no-shows and optimizing your calendar.
        </p>
        <div className="flex gap-2">
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Automation
          </span>
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Scheduling
          </span>
        </div>
      </div>
      
      {/* Service Card 3 */}
      <div className="bg-black/50 border border-white/20 rounded-lg p-6 transition-transform transform hover:scale-105 group">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mr-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide text-white">
            AI Calling Agent
          </h3>
        </div>
        <p className="text-white/70 mb-4">
          Automate your outbound calls and follow-ups with our AI calling agent, ensuring you never miss a lead.
        </p>
        <div className="flex gap-2">
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Automation
          </span>
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Calling
          </span>
        </div>
      </div>
      
      {/* Service Card 4 */}
      <div className="bg-black/50 border border-white/20 rounded-lg p-6 transition-transform transform hover:scale-105 group">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mr-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide text-white">
            Website Building
          </h3>
        </div>
        <p className="text-white/70 mb-4">
          Get a professional website that converts visitors into customers, tailored to your business needs.
        </p>
        <div className="flex gap-2">
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Web Development
          </span>
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Design
          </span>
        </div>
      </div>
      
      {/* Service Card 5 */}
      <div className="bg-black/50 border border-white/20 rounded-lg p-6 transition-transform transform hover:scale-105 group">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mr-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold tracking-wide text-white">
            Other Services
          </h3>
        </div>
        <p className="text-white/70 mb-4">
          Have a unique project in mind? Let's discuss how we can bring your vision to life with our custom solutions.
        </p>
        <div className="flex gap-2">
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Custom Solutions
          </span>
          <span className="text-xs tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1">
            Consultation
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* About Section - Hidden by default */}
  <div id="about" className="relative z-10 max-w-6xl mx-auto px-4 py-32 hidden">
    <h2 className="text-4xl font-light tracking-[0.1em] text-white mb-12 text-center">
      ABOUT US
    </h2>
    
    <div className="bg-black/50 border border-white/20 rounded-lg p-8 max-w-3xl mx-auto">
      <p className="text-white/70 mb-4">
        We are a team of passionate professionals dedicated to leveraging the power of AI to transform businesses. Our mission is to automate and optimize your workflows, enhance customer engagement, and drive growth.
      </p>
      <p className="text-white/70 mb-4">
        With years of experience in AI development, marketing, and business automation, we understand the unique challenges businesses face. That's why we offer tailored solutions that fit your specific needs and goals.
      </p>
      <p className="text-white/70 mb-4">
        Let's work together to unlock the full potential of your business and achieve remarkable results.
      </p>
    </div>
  </div>

  {/* Contact Section - Hidden by default */}
  <div id="contact" className="relative z-10 max-w-6xl mx-auto px-4 py-32 hidden">
    <h2 className="text-4xl font-light tracking-[0.1em] text-white mb-12 text-center">
      CONTACT US
    </h2>
    
    <div className="bg-black/50 border border-white/20 rounded-lg p-8 max-w-3xl mx-auto">
      <p className="text-white/70 mb-4">
        Have questions or ready to start your project? Get in touch with us today!
      </p>
      <p className="text-white/70 mb-4">
        Email: <a href="mailto:info@yourcompany.com" className="text-emerald-400 hover:underline">info@yourcompany.com</a>
      </p>
      <p className="text-white/70 mb-4">
        Phone: <a href="tel:+1234567890" className="text-emerald-400 hover:underline">+1 (234) 567-890</a>
      </p>
      <p className="text-white/70 mb-4">
        Address: 123 Your Street, City, Country
      </p>
    </div>
  </div>
</div>
  );
};

export default Index;
