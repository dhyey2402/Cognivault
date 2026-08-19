import { useEffect, useRef } from 'react';

export default function SpatialBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Config
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GRID_SIZE = 25; // number of points per axis
    const SPACING = 50;   // spacing in 3d units
    const BASE_Y = 200;   // base height below camera
    const SPEED = isReducedMotion ? 0 : 0.001; // slower speed for calm effect
    const FOCAL_LENGTH = 300; // perspective intensity

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let time = 0;
    
    // Parallax state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Mouse handler
    const handleMouseMove = (e) => {
      if (isReducedMotion) return;
      // Map mouse to -1 to 1 range
      targetMouseX = (e.clientX / width) * 2 - 1;
      targetMouseY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // The grid is centered at x=0, z starts slightly in front of camera (z > 0)
    const points = [];
    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        points.push({
          x: x * SPACING,
          z: z * SPACING + 50, // offset z so it's not right at camera
          baseY: BASE_Y,
          // Random offset for nodes to make it look organic
          offsetX: (Math.random() - 0.5) * 15,
          offsetZ: (Math.random() - 0.5) * 15,
          activePhase: Math.random() * Math.PI * 2 // for pulsing
        });
      }
    }

    // Helper to project 3D to 2D
    const project = (x, y, z) => {
      // Avoid division by zero
      const safeZ = z < 1 ? 1 : z;
      const scale = FOCAL_LENGTH / safeZ;
      // Center projection on screen
      const screenX = width / 2 + x * scale;
      const screenY = height / 2 + y * scale;
      return { x: screenX, y: screenY, scale };
    };

    const draw = () => {
      time += SPEED;
      
      // Smoothly interpolate mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Dark atmospheric background
      ctx.fillStyle = '#050B14'; // very dark slate/indigo
      ctx.fillRect(0, 0, width, height);

      // Subtle gradient at bottom for depth
      const grad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(79, 70, 229, 0.05)'); // subtle primary color
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const projectedPoints = [];
      const cameraYOffset = currentMouseY * 50;
      const cameraXOffset = currentMouseX * 100;

      // Calculate 3D points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Continuous flowing motion in Z direction
        // When point goes behind camera, wrap it to the back
        let currentZ = p.z - (time * 500) % SPACING; 
        if (currentZ < 10) currentZ += GRID_SIZE * SPACING;

        // Wave function for Y
        // Combination of sine waves based on X and Z for a rolling terrain effect
        const wave1 = Math.sin(p.x * 0.02 + time * 1000) * 30;
        const wave2 = Math.cos(currentZ * 0.01 + time * 800) * 40;
        const y = p.baseY + wave1 + wave2 + cameraYOffset;
        
        const x = p.x + p.offsetX + cameraXOffset;

        const proj = project(x, y, currentZ);
        
        // Calculate point visibility based on distance
        const distRatio = currentZ / (GRID_SIZE * SPACING);
        const opacity = Math.max(0, 1 - distRatio); // Fade out in distance
        
        projectedPoints.push({
          ...proj,
          opacity,
          z: currentZ,
          activePhase: p.activePhase
        });
      }

      // Sort by Z to draw back to front (painter's algorithm)
      // Though for additive blending or simple lines, sorting isn't strictly necessary, it helps.
      projectedPoints.sort((a, b) => b.z - a.z);

      // Draw lines and nodes
      ctx.lineWidth = 1;
      
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        if (p.opacity <= 0.01) continue;

        // Draw node
        const pulse = Math.sin(time * 2000 + p.activePhase) * 0.5 + 0.5;
        // Nodes closer are larger
        const nodeSize = Math.max(0.5, p.scale * 3);
        
        // Base color + subtle primary glow based on pulse
        const alpha = p.opacity * (0.3 + pulse * 0.5);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Optional: glowing effect for select nodes
        if (pulse > 0.9 && p.z < (GRID_SIZE * SPACING * 0.5)) {
           ctx.shadowBlur = 10;
           ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
           ctx.fillStyle = `rgba(165, 180, 252, ${alpha + 0.2})`;
           ctx.beginPath();
           ctx.arc(p.x, p.y, nodeSize * 1.5, 0, Math.PI * 2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }

        // Draw interconnected lines to nearby nodes to form a mesh
        // To be performant, we only connect to the "next" node in the array
        // (This is a simplified mesh drawing that looks sufficiently interconnected)
        if (i < projectedPoints.length - 1) {
            const nextP = projectedPoints[i + 1];
            // Only connect if they are somewhat close in 3D space to avoid long cross-screen lines
            const dx = p.x - nextP.x;
            const dy = p.y - nextP.y;
            const dist = dx*dx + dy*dy;
            
            if (dist < 15000 * p.scale) {
                const lineAlpha = p.opacity * 0.15;
                ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(nextP.x, nextP.y);
                ctx.stroke();
            }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Start animation
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
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      style={{
        background: '#050B14' // fallback if canvas fails
      }}
    />
  );
}
