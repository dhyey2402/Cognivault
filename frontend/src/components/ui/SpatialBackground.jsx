import { useEffect, useRef } from 'react';

export default function SpatialBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Config
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    const FOCAL_LENGTH = isMobile ? 500 : 800; 
    const CAMERA_Z = -500;
    
    const GRID_COLS = isMobile ? 25 : 55;
    const GRID_ROWS = isMobile ? 30 : 65;
    const GRID_SPACING_X = isMobile ? 200 : 160;
    const GRID_SPACING_Z = isMobile ? 250 : 200;
    const START_Z = 200;
    const SPEED = isReducedMotion ? 0 : 2.5;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let time = 0;
    let zOffset = 0;
    
    // Parallax
    let targetCamX = 0;
    let targetCamY = 0;
    let camX = 0;
    let camY = 0;

    // Pseudo-random hash to keep nodes statically pinned to the flowing terrain
    const hash = (x, z) => {
      let h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
      return h - Math.floor(h);
    };

    const getElevation = (gx, gz, t) => {
      // gx and gz are world coordinates
      // Wave 1: large sweeping organic hills
      const w1 = Math.sin(gx * 0.0008 + t * 0.4) * Math.cos(gz * 0.0008 + t * 0.3) * 400;
      // Wave 2: medium disruptive details
      const w2 = Math.sin(gx * 0.002 - t * 0.6) * Math.sin(gz * 0.002 + t * 0.5) * 150;
      // Wave 3: central valley (pushes the terrain down in the center so UI remains readable)
      const valleyFactor = Math.exp(-(gx * gx) / 1500000);
      
      // Base elevation + waves + deep central valley
      return 250 + w1 + w2 + (valleyFactor * 300);
    };

    const project = (x, y, z) => {
      const relX = x - camX;
      const relY = y - camY;
      const relZ = z - CAMERA_Z;

      if (relZ <= 0) return null;

      const scale = FOCAL_LENGTH / relZ;
      const screenX = width / 2 + relX * scale;
      const screenY = height / 2 + relY * scale;

      return { x: screenX, y: screenY, scale, z: relZ };
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleMouseMove = (e) => {
      if (isReducedMotion || isMobile) return;
      // Parallax mapped to a spatial shift
      targetCamX = ((e.clientX / width) - 0.5) * 1000;
      targetCamY = ((e.clientY / height) - 0.5) * 350;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const draw = () => {
      time += 0.016;
      zOffset = (zOffset + SPEED) % GRID_SPACING_Z;

      camX += (targetCamX - camX) * 0.03;
      camY += (targetCamY - camY) * 0.03;

      // Base background (very deep navy/black)
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(0, 0, width, height);

      const halfCols = Math.floor(GRID_COLS / 2);

      // 1. Pre-calculate the grid points for this frame
      const grid = [];
      for (let r = 0; r <= GRID_ROWS; r++) {
        const row = [];
        const worldZ = START_Z + r * GRID_SPACING_Z - zOffset;
        
        for (let c = 0; c <= GRID_COLS; c++) {
          const worldX = (c - halfCols) * GRID_SPACING_X;
          const worldY = getElevation(worldX, worldZ, time);
          
          const p = project(worldX, worldY, worldZ);
          
          // Determine if this intersection hosts a knowledge node
          const gridZId = Math.round(worldZ / GRID_SPACING_Z);
          const gridXId = c;
          
          const isNode = hash(gridXId, gridZId) > (isMobile ? 0.95 : 0.92);
          const nodeType = isNode ? Math.floor(hash(gridXId + 1, gridZId) * 3) : 0;
          
          row.push({ p, isNode, nodeType, worldZ, worldX });
        }
        grid.push(row);
      }

      // 2. Draw quads back-to-front (Painter's Algorithm for occlusion)
      const maxZ = START_Z + GRID_ROWS * GRID_SPACING_Z;
      
      for (let r = GRID_ROWS - 1; r >= 0; r--) {
        for (let c = 0; c < GRID_COLS; c++) {
          const p1 = grid[r][c];
          const p2 = grid[r][c+1];
          const p3 = grid[r+1][c+1];
          const p4 = grid[r+1][c];

          // Skip if quad is behind camera
          if (!p1.p || !p2.p || !p3.p || !p4.p) continue;

          // Depth based alpha calculation
          const avgZ = (p1.worldZ + p2.worldZ + p3.worldZ + p4.worldZ) / 4;
          const depthRatio = Math.max(0, 1 - (avgZ / maxZ));
          
          // Exponential fade for smooth horizon blend
          const alpha = Math.pow(depthRatio, 1.8); 
          
          if (alpha < 0.02) continue; // cull invisible geometry

          // Draw the physical quad
          ctx.beginPath();
          ctx.moveTo(p1.p.x, p1.p.y);
          ctx.lineTo(p2.p.x, p2.p.y);
          ctx.lineTo(p3.p.x, p3.p.y);
          ctx.lineTo(p4.p.x, p4.p.y);
          ctx.closePath();

          // Fill with base color to occlude lines behind it (solid terrain illusion)
          ctx.fillStyle = '#020617';
          ctx.fill();

          // Highlight center paths for visual structure
          const isCenter = Math.abs(c - halfCols) < 4;
          
          // Dynamic data pulses flowing down the grid lines
          const pulseHash = hash(c, 0);
          const isPulseCol = pulseHash > 0.85;
          const pulseZ = (time * 1800 * pulseHash) % maxZ;
          const distToPulse = Math.abs(avgZ - pulseZ);
          const pulseGlow = isPulseCol && distToPulse < 1000 ? 1 - (distToPulse / 1000) : 0;

          if (pulseGlow > 0 && !isReducedMotion) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.9 + pulseGlow * 0.6})`; // Electric violet pulse
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = `rgba(49, 46, 129, ${alpha * (isCenter ? 0.6 : 0.25)})`; // Deep indigo grid
            ctx.lineWidth = 1;
          }
          
          ctx.stroke();

          // Draw Nodes at the front-left vertex
          if (p1.isNode) {
            const screenRadius = Math.max(0.5, 3.5 * p1.p.scale);
            ctx.beginPath();
            ctx.arc(p1.p.x, p1.p.y, screenRadius, 0, Math.PI * 2);
            
            if (p1.nodeType === 0) {
              ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`; // Cyan
            } else if (p1.nodeType === 1) {
              ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`; // Magenta/Purple
            } else {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Bright Core
            }
            ctx.fill();

            // Glow for foreground nodes
            if (alpha > 0.3 && !isMobile && !isReducedMotion) {
              ctx.shadowBlur = 15;
              ctx.shadowColor = ctx.fillStyle;
              ctx.beginPath();
              ctx.arc(p1.p.x, p1.p.y, screenRadius * 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 3. Volumetric Atmospheric Fog & UI Contrast Layer
      const cx = width / 2;
      const cy = height / 2;
      
      // Radial vignette to darken edges and keep focus centered
      const vignette = ctx.createRadialGradient(cx, cy, height * 0.2, cx, cy, Math.max(width, height) * 0.85);
      vignette.addColorStop(0, 'rgba(2, 6, 23, 0)'); // clear center
      vignette.addColorStop(1, 'rgba(2, 6, 23, 0.92)'); // dark edges
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Linear horizon fog to smoothly blend the distant terrain into the sky
      const horizon = ctx.createLinearGradient(0, 0, 0, height);
      horizon.addColorStop(0, 'rgba(2, 6, 23, 1)'); // completely opaque sky
      horizon.addColorStop(0.35, 'rgba(2, 6, 23, 0.8)'); // dense horizon mist
      horizon.addColorStop(0.7, 'rgba(2, 6, 23, 0)'); // clear foreground
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, width, height);
      
      // Subtle darkening overlay to ensure UI elements (cards/text) remain readable
      ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
      ctx.fillRect(0, 0, width, height);

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
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
