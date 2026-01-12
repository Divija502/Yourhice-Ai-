import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; z: number; o: number }[] = [];
    let animationFrameId: number;
    const particleCount = 200;
    const speed = 0.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (Math.random() - 0.5) * canvas.width,
          y: (Math.random() - 0.5) * canvas.height,
          z: Math.random() * canvas.width,
          o: Math.random() // opacity base
        });
      }
    };

    const draw = () => {
      // Create a trail effect
      ctx.fillStyle = 'rgba(15, 15, 18, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach(p => {
        // Move particle towards viewer
        p.z -= speed;

        // Reset if passed viewer
        if (p.z <= 0) {
          p.z = canvas.width;
          p.x = (Math.random() - 0.5) * canvas.width;
          p.y = (Math.random() - 0.5) * canvas.height;
        }

        // Project 3D position to 2D
        const scale = 200 / p.z; // Perspective
        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;
        
        // Calculate size and opacity based on depth
        const size = Math.max(0.5, (1 - p.z / canvas.width) * 3);
        const opacity = (1 - p.z / canvas.width) * p.o;

        // Draw star
        ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`; // Purple tint
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 bg-[#0f0f12]"
      style={{ opacity: 0.8 }}
    />
  );
};

export default Background;