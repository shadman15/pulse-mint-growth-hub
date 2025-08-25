
import React from 'react';
import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Logo Icon */}
      <div className="relative">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-transparent from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center">
          <img
  src="/images/bg remove complete (1).png"
  alt="My Logo"
  className="w-8 h-8 md:w-10 md:h-10"
/>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg blur-sm opacity-50"></div>
      </div>
      
      {/* Logo Text - Hidden on mobile */}
      <div className="hidden md:block text-xl md:text-2xl font-light tracking-wider text-white">
        PULSE<span className="text-emerald-400">MINT</span>
      </div>
    </div>
  );
};

export default Logo;
