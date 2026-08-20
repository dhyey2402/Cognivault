import { useEffect, useRef, useState } from 'react';

export default function SpatialBackground() {
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [performanceTier, setPerformanceTier] = useState('high'); // 'high', 'low'

  useEffect(() => {
    // 1. Capability Detection
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    // Conservative check: if less than 4 cores or mobile, go to low-tier
    const hwConcurrency = navigator.hardwareConcurrency || 4;
    
    if (isReducedMotion || isMobile || hwConcurrency < 4) {
      setPerformanceTier('low');
    }

    // 2. Intersection Observer to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 } // Any part visible = active
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3. Parallax Mouse Listener
  useEffect(() => {
    if (performanceTier === 'low' || !isVisible) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      // Small clamped shift (e.g., -15px to +15px)
      const xPercent = (e.clientX / window.innerWidth) - 0.5;
      const yPercent = (e.clientY / window.innerHeight) - 0.5;
      targetX = xPercent * -30; // Inverse movement
      targetY = yPercent * -20;
    };

    const updateParallax = () => {
      if (parallaxRef.current) {
        // Smooth interpolation
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        
        parallaxRef.current.style.setProperty('--px', `${currentX}px`);
        parallaxRef.current.style.setProperty('--py', `${currentY}px`);
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [performanceTier, isVisible]);

  // If we are paused/invisible, we can set play-state to paused via a class
  const isPaused = !isVisible || performanceTier === 'low';

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#020617] overflow-hidden"
    >
      {/* Deep Atmosphere Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,27,75,0.6)_0%,rgba(2,6,23,0)_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.1)_0%,rgba(2,6,23,0)_50%)]"></div>
      
      {/* Parallax Container */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{ transform: 'translate3d(var(--px, 0), var(--py, 0), 0)' }}
      >
        {/* Layer 2: Perspective Grid */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[100vh]"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* The actual receding plane */}
          <div 
            className="absolute bottom-0 w-full h-[150%] origin-bottom"
            style={{
              transform: 'rotateX(75deg) scale(1.5)',
              // The Grid Pattern
              backgroundImage: `
                linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: 'center bottom',
              // Fade out into the horizon (top) and edges
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%), radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%)',
              // Conditionally animate if not paused
              animation: isPaused ? 'none' : 'grid-move 4s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          ></div>
        </div>

        {/* Layer 3: Ambient Nodes (Only on High Performance Tier) */}
        {performanceTier === 'high' && (
          <div className="absolute inset-0">
            {/* Cyan Node */}
            <div 
              className="absolute left-[30%] top-[40%] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_20px_4px_rgba(34,211,238,0.5)]"
              style={{
                animation: isPaused ? 'none' : 'float-node 8s ease-in-out infinite',
                animationDelay: '0s'
              }}
            ></div>
            {/* Violet Node */}
            <div 
              className="absolute right-[25%] top-[60%] w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_20px_6px_rgba(167,139,250,0.5)]"
              style={{
                animation: isPaused ? 'none' : 'float-node 10s ease-in-out infinite',
                animationDelay: '2s'
              }}
            ></div>
            {/* Far Deep Blue Node */}
            <div 
              className="absolute left-[60%] top-[30%] w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] blur-[1px] opacity-60"
              style={{
                animation: isPaused ? 'none' : 'float-node 12s ease-in-out infinite',
                animationDelay: '5s'
              }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Subtle UI Contrast Overlay */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
    </div>
  );
}
