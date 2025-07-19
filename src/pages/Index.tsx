import React, { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';

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
}: {
  direction?: string;
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>();
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

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
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const animateTexts = () => {
      setCurrentText('PULSE');
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 2000);
      setTimeout(() => {
        setCurrentText('MINT');
        setIsVisible(true);
      }, 3000);
      setTimeout(() => setIsVisible(false), 5000);
    };

    const initialTimer = setTimeout(animateTexts, 500);
    const interval = setInterval(animateTexts, 6000);

    const handleMouseMove = (e: MouseEvent) => {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-light">
      {/* Background Squares */}
      <div className="fixed inset-0 z-0">
        <Squares direction="right" speed={1} borderColor="#10b981" squareSize={40} hoverFillColor="#065f46" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-4 md:p-8">
        <Logo />
        <nav className="flex gap-3 md:gap-8">
          <button className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded">
            SERVICES
          </button>
          <button className="text-xs md:text-sm tracking-wider border border-white/20 px-3 py-2 md:px-4 md:py-2 bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded whitespace-nowrap">
            BOOK A CALL
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Central glowing animated ring */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-white/40 to-emerald-500/30 animate-pulse blur-xl"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-emerald-400/50 via-white/60 to-emerald-400/50 blur-lg"></div>

            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-emerald-500 via-white to-emerald-500 p-1" style={{
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)',
              animation: 'pulse 3s ease-in-out infinite'
            }}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-900/90 via-black to-emerald-900/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-light tracking-[0.4em] text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {currentText}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-full bg-gradient-conic from-emerald-500 via-white via-emerald-500 via-white to-emerald-500 opacity-20 animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-8 rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
