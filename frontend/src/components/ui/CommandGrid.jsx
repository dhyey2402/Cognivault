import { useEffect, useRef } from 'react';

export default function CommandGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Config
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GRID_SIZE = 30; // number of points per axis
    const SPACING = 60;   // spacing in 3d units
    const BASE_Y = 150;   // base height below camera
    const SPEED = isReducedMotion ? 0 : 0.002; // slow constant movement
    const FOCAL_LENGTH = 400; // perspective intensity

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let time = 0;
    
    // Parallax state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleMouseMove = (e) => {
      if (isReducedMotion) return;
      targetMouseX = (e.clientX / width) * 2 - 1;
      targetMouseY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // The grid is centered at x=0
    const points = [];
    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        // Less random offset for a more "command grid" structured look
        points.push({
          x: x * SPACING,
          z: z * SPACING + 20, 
          baseY: BASE_Y,
          activePhase: Math.random() * Math.PI * 2,
          isHub: Math.random() > 0.95 // 5% chance to be a major glowing hub
        });
      }
    }

    const project = (x, y, z) => {
      const safeZ = z < 1 ? 1 : z;
      const scale = FOCAL_LENGTH / safeZ;
      const screenX = width / 2 + x * scale;
      const screenY = height / 2 + y * scale;
      return { x: screenX, y: screenY, scale };
    };

    const draw = () => {
      time += SPEED;
      
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Dark command center background
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan/emerald gradient at bottom for depth
      const grad = ctx.createLinearGradient(0, height * 0.3, 0, height);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.03)'); // subtle emerald
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const projectedPoints = [];
      const cameraYOffset = currentMouseY * 60;
      const cameraXOffset = currentMouseX * 120;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Structured forward motion
        let currentZ = p.z - (time * 300) % SPACING; 
        if (currentZ < 10) currentZ += GRID_SIZE * SPACING;

        // Structured tech-wave (more rigid than the organic student wave)
        const wave = Math.sin(p.x * 0.01 + time * 50) * Math.cos(currentZ * 0.01 + time * 50) * 40;
        const y = p.baseY + wave + cameraYOffset;
        
        const x = p.x + cameraXOffset;

        const proj = project(x, y, currentZ);
        
        const distRatio = currentZ / (GRID_SIZE * SPACING);
        const opacity = Math.max(0, 1 - distRatio); 
        
        projectedPoints.push({
          ...proj,
          opacity,
          z: currentZ,
          activePhase: p.activePhase,
          isHub: p.isHub
        });
      }

      projectedPoints.sort((a, b) => b.z - a.z);

      ctx.lineWidth = 1;
      
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        if (p.opacity <= 0.01) continue;

        const pulse = Math.sin(time * 1000 + p.activePhase) * 0.5 + 0.5;
        const nodeSize = Math.max(0.5, p.scale * (p.isHub ? 3 : 1.5));
        
        const alpha = p.opacity * (0.4 + pulse * 0.6);
        
        // Cyan / Emerald colors for command center
        const color = p.isHub ? `rgba(16, 185, 129, ${alpha})` : `rgba(6, 182, 212, ${alpha * 0.7})`;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        if (p.isHub && p.z < (GRID_SIZE * SPACING * 0.6)) {
           ctx.shadowBlur = 15;
           ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
           ctx.fillStyle = `rgba(52, 211, 153, ${alpha + 0.2})`;
           ctx.beginPath();
           ctx.arc(p.x, p.y, nodeSize * 1.5, 0, Math.PI * 2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }

        // Connect nodes strictly along Z and X axes for a grid look
        // (Simplified mesh drawing logic)
        if (i < projectedPoints.length - 1) {
            const nextP = projectedPoints[i + 1];
            const dx = p.x - nextP.x;
            const dy = p.y - nextP.y;
            const dist = dx*dx + dy*dy;
            
            if (dist < 20000 * p.scale) {
                const lineAlpha = p.opacity * (p.isHub ? 0.3 : 0.1);
                ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(nextP.x, nextP.y);
                ctx.stroke();
            }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: '#020617' 
      }}
    />
  );
}
