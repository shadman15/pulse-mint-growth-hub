import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { Squares } from '../components/ui/squares-background';
import MissedCallSections, { ClosingCta } from '../components/MissedCallSections';
import { BOOK_CALL_URL } from '../lib/links';
import { useAgentCall } from '../components/AgentCallModal';

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
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

  const { openAgentCall } = useAgentCall();

  const openBooking = () => {
    window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-light">
      {/* Squares Background */}
      <div className="absolute inset-0 z-0">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="rgba(16, 185, 129, 0.3)" 
          hoverFillColor="rgba(16, 185, 129, 0.1)"
          className="w-full h-full"
        />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-4 md:p-8">
        <Logo />
        <nav className="flex gap-3 md:gap-8">
          <button
            onClick={openAgentCall}
            className="inline-flex items-center gap-2 text-xs md:text-sm tracking-wider border border-emerald-500/50 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 hover:from-emerald-500/40 hover:to-emerald-400/40 transition-all duration-300 text-white rounded whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            TEST AGENT NOW
          </button>
          <button 
            onClick={openBooking}
            className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded whitespace-nowrap"
          >
            BOOK A CALL
          </button>
        </nav>
      </header>

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] pt-4 md:pt-8 pb-40">
        {/* Hero headline */}
        <div className="text-center px-6 mb-16 lg:mb-44 pm-hero-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-[0.1em] md:tracking-[0.16em] leading-tight text-white max-w-5xl mx-auto">
            <span className="pm-shimmer-text font-normal">Pulsemint:</span>{' '}
            <span className="text-white/90">The best AI voice agent Builder</span>
          </h1>
          <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
        </div>

        <div 
          className="relative flex items-center justify-center"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Product labels - Hidden on mobile */}
          <div className="absolute right-full mr-16 top-1/2 -translate-y-1/2 hidden lg:block">
            <div 
              className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => scrollToSection('how-it-works')}
            >
              ANSWERS
            </div>
          </div>
          
          <div className="absolute left-full ml-16 top-1/2 -translate-y-1/2 hidden lg:block">
            <div 
              className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer"
              onClick={() => scrollToSection('how-it-works')}
            >
              CAPTURES
            </div>
          </div>

          {/* Top labels - Hidden on mobile */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 hidden lg:block">
            <div className="text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-white/60 font-light whitespace-nowrap">
              WHEN YOU CAN’T PICK UP
            </div>
          </div>

          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2">
            <div className="text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-white/60 font-light whitespace-nowrap">
              TEXTS YOU THE DETAILS
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

      {/* Missed-call voice agent sections */}
      <MissedCallSections />

      <ClosingCta />

      {/* Footer */}
      <footer className="relative z-20 p-8 mt-12 border-t border-white/10">
        <div className="text-center space-y-2">
          <div className="text-xs tracking-wider text-white/50">
            © PULSEMINT · LOWESTOFT, UK
          </div>
          <div className="text-xs tracking-wider text-white/30">
            Calls to the assistant may be recorded for service purposes. Company registration: 16467783
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
