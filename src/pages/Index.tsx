import React, { useState, useEffect, useRef } from 'react';
import { Bot, Zap, Globe, Clock, CheckCircle, ArrowRight, Star, Settings } from 'lucide-react';

// Logo component
const Logo = () => (
  <div className="text-xl md:text-2xl font-light tracking-[0.3em] text-white">
    PULSE MINT
  </div>
);

// Squares background component
const Squares = ({
  direction = "right",
  speed = 1,
  borderColor = "#333",
  squareSize = 40,
  hoverFillColor = "#222",
  className = "",
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      ctx.lineWidth = 0.5;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquare &&
            Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquare.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2,
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "#000000");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);

      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize,
      );
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize,
      );

      setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
    };

    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full border-none block ${className}`}
    />
  );
};

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [backgroundSettings, setBackgroundSettings] = useState({
    direction: 'right',
    speed: 1,
    borderColor: '#10b981',
    squareSize: 40,
    hoverFillColor: '#065f46'
  });
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
      setCurrentText('PULSE');
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      
      setTimeout(() => {
        setCurrentText('MINT');
        setIsVisible(true);
      }, 3000);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };
  
    const initialTimer = setTimeout(animateTexts, 500);
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

  const handleSettingsChange = (field, value) => {
    setBackgroundSettings(prev => ({
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
      {/* Animated Squares Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction={backgroundSettings.direction}
          speed={backgroundSettings.speed}
          borderColor={backgroundSettings.borderColor}
          squareSize={backgroundSettings.squareSize}
          hoverFillColor={backgroundSettings.hoverFillColor}
        />
      </div>

      {/* Background Settings Popup */}
      {showSettings && (
        <div className="fixed bottom-20 left-4 z-50 bg-gradient-to-br from-gray-900/95 via-black/95 to-emerald-900/95 border border-emerald-500/30 rounded-lg p-6 w-80">
          <h3 className="text-lg font-light tracking-wider text-white mb-4">BACKGROUND SETTINGS</h3>
          
          <div className="space-y-4">
            {/* Direction */}
            <div>
              <label className="block text-sm tracking-wider text-white/80 mb-2">DIRECTION</label>
              <select
                value={backgroundSettings.direction}
                onChange={(e) => handleSettingsChange('direction', e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-emerald-500/50 focus:outline-none transition-colors text-sm"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="diagonal">Diagonal</option>
              </select>
            </div>

            {/* Speed */}
            <div>
              <label className="block text-sm tracking-wider text-white/80 mb-2">SPEED: {backgroundSettings.speed}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={backgroundSettings.speed}
                onChange={(e) => handleSettingsChange('speed', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Square Size */}
            <div>
              <label className="block text-sm tracking-wider text-white/80 mb-2">SIZE: {backgroundSettings.squareSize}px</label>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={backgroundSettings.squareSize}
                onChange={(e) => handleSettingsChange('squareSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Border Color */}
            <div>
              <label className="block text-sm tracking-wider text-white/80 mb-2">BORDER COLOR</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundSettings.borderColor}
                  onChange={(e) => handleSettingsChange('borderColor', e.target.value)}
                  className="w-12 h-8 bg-transparent border border-white/20 rounded"
                />
                <input
                  type="text"
                  value={backgroundSettings.borderColor}
                  onChange={(e) => handleSettingsChange('borderColor', e.target.value)}
                  className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-emerald-500/50 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Hover Fill Color */}
            <div>
              <label className="block text-sm tracking-wider text-white/80 mb-2">HOVER COLOR</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundSettings.hoverFillColor}
                  onChange={(e) => handleSettingsChange('hoverFillColor', e.target.value)}
                  className="w-12 h-8 bg-transparent border border-white/20 rounded"
                />
                <input
                  type="text"
                  value={backgroundSettings.hoverFillColor}
                  onChange={(e) => handleSettingsChange('hoverFillColor', e.target.value)}
                  className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-emerald-500/50 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-4 w-full text-sm tracking-wider border border-emerald-500/50 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300 text-white rounded"
          >
            CLOSE
          </button>
        </div>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed bottom-4 left-4 z-40 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 border border-emerald-500/50 p-3 rounded-full text-white hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300"
      >
        <Settings size={20} />
      </button>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900/95 via-black/95 to-emerald-900/95 border border-emerald-500/30 rounded-lg p-8 max-h-[90vh] overflow-y-auto">
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
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm tracking-wider text-white/80 mb-2">SELECT DATE</label>
                  <select
                    required
                    value={formData.selectedDate}
                    onChange={(e) => {
                      handleInputChange('selectedDate', e.target.value);
                      handleInputChange('selectedTime', '');
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
            onClick={() => setShowBookingForm(true)}
            className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded whitespace-nowrap"
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
      </div>
    </div>
  );
};

export default Index;