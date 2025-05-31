
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
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
          <Button className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white">
            [ ABOUT US ]
          </Button>
          <Button className="text-sm tracking-wider border border-white/20 px-4 py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white">
            [ DOCUMENTATION ]
          </Button>
        </nav>
      </header>

      {/* Main content */}
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
            <div className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer">
              AI AUTOMATION
            </div>
          </div>
          
          <div className="absolute -right-48 top-1/2 -translate-y-1/2">
            <div className="text-2xl font-light tracking-[0.3em] text-white/80 hover:text-white transition-colors cursor-pointer">
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
                {/* Inner content */}
                <div className="text-center">
                  <div 
                    className={`text-4xl font-light tracking-[0.4em] text-white transition-all duration-1000 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    PULSE
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
      <style>{`
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
