import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Video, Cpu, Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
}

interface CircuitTrace {
  points: { x: number; y: number }[];
  color: string;
  pulseProgress: number;
  pulseSpeed: number;
  pulseLength: number;
}

export const GPUVideoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initCircuits();
    };

    window.addEventListener('resize', handleResize);

    // Track mouse for electromagnetic ripples
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    // --- Particles (Electrons & Overclocking Sparks) ---
    const particles: Particle[] = [];
    const particleColors = ['#00F0FF', '#38BDF8', '#818CF8', '#A855F7', '#10B981'];

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.4 - Math.random() * 0.9,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        maxLife: Math.random() * 200 + 100,
        life: Math.random() * 200,
      });
    }

    // --- Procedural GPU PCB Circuit Traces ---
    let circuits: CircuitTrace[] = [];

    const initCircuits = () => {
      circuits = [];
      const numLines = Math.floor(width / 70);

      for (let i = 0; i < numLines; i++) {
        const startX = (i * width) / numLines + (Math.random() * 40 - 20);
        let currX = startX;
        let currY = Math.random() * (height * 0.3);

        const points = [{ x: currX, y: currY }];
        const segments = 4 + Math.floor(Math.random() * 4);

        for (let s = 0; s < segments; s++) {
          const dir = Math.random();
          if (dir < 0.4) {
            // Diagonal step
            currX += (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 50);
            currY += 40 + Math.random() * 60;
          } else {
            // Vertical step
            currY += 60 + Math.random() * 80;
          }
          points.push({ x: currX, y: currY });
          if (currY > height) break;
        }

        circuits.push({
          points,
          color: Math.random() > 0.3 ? '#00F0FF' : '#A855F7',
          pulseProgress: Math.random(),
          pulseSpeed: 0.003 + Math.random() * 0.006,
          pulseLength: 0.15 + Math.random() * 0.2,
        });
      }
    };

    initCircuits();

    // --- Fan Rotation Angles ---
    let fanAngle1 = 0;
    let fanAngle2 = 0;
    let corePulse = 0;

    // --- Animation Loop ---
    const render = () => {
      if (!isPlaying) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background circuit grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Holographic Spinning GPU Dual Fans (in deep background)
      fanAngle1 += 0.025;
      fanAngle2 -= 0.028;

      const drawHoloFan = (cx: number, cy: number, radius: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(cx, cy);

        // Outer neon ring
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner motor hub
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 15, 28, 0.85)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 9 Aerodynamic fan blades
        const blades = 9;
        for (let b = 0; b < blades; b++) {
          const bladeAngle = angle + (b * Math.PI * 2) / blades;
          ctx.beginPath();
          ctx.moveTo(Math.cos(bladeAngle) * (radius * 0.28), Math.sin(bladeAngle) * (radius * 0.28));
          ctx.quadraticCurveTo(
            Math.cos(bladeAngle + 0.35) * (radius * 0.7),
            Math.sin(bladeAngle + 0.35) * (radius * 0.7),
            Math.cos(bladeAngle + 0.15) * radius,
            Math.sin(bladeAngle + 0.15) * radius
          );
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      };

      // Position dual holographic fans in ambient right background
      const fan1X = width * 0.76;
      const fan1Y = height * 0.48;
      const fan2X = width * 0.88;
      const fan2Y = height * 0.52;
      const fanRadius = Math.min(width * 0.14, 140);

      if (width > 768) {
        drawHoloFan(fan1X, fan1Y, fanRadius, fanAngle1, 'rgba(0, 240, 255, 0.12)');
        drawHoloFan(fan2X, fan2Y, fanRadius * 0.85, fanAngle2, 'rgba(168, 85, 247, 0.10)');
      }

      // 3. Draw GPU Silicon Die in center-right
      corePulse += 0.04;
      const coreGlow = 0.5 + Math.sin(corePulse) * 0.25;

      const dieX = width * 0.42;
      const dieY = height * 0.45;
      const dieSize = Math.min(width * 0.12, 100);

      if (width > 640) {
        ctx.save();
        ctx.translate(dieX, dieY);

        // Core glow aura
        const dieGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, dieSize * 1.5);
        dieGrad.addColorStop(0, `rgba(0, 240, 255, ${0.15 * coreGlow})`);
        dieGrad.addColorStop(0.6, `rgba(168, 85, 247, ${0.08 * coreGlow})`);
        dieGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = dieGrad;
        ctx.fillRect(-dieSize * 1.5, -dieSize * 1.5, dieSize * 3, dieSize * 3);

        // Die package square
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 * coreGlow})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-dieSize / 2, -dieSize / 2, dieSize, dieSize);

        // Inner silicon core
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 * coreGlow})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-dieSize / 3, -dieSize / 3, (dieSize * 2) / 3, (dieSize * 2) / 3);

        // Surrounding 6 GDDR6X Memory Chips
        const memOffsets = [
          { x: -dieSize * 0.8, y: -dieSize * 0.3 },
          { x: -dieSize * 0.8, y: dieSize * 0.3 },
          { x: dieSize * 0.8, y: -dieSize * 0.3 },
          { x: dieSize * 0.8, y: dieSize * 0.3 },
          { x: -dieSize * 0.2, y: -dieSize * 0.8 },
          { x: dieSize * 0.2, y: -dieSize * 0.8 },
        ];

        memOffsets.forEach((mem) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.fillRect(mem.x - 12, mem.y - 8, 24, 16);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
          ctx.strokeRect(mem.x - 12, mem.y - 8, 24, 16);
        });

        ctx.restore();
      }

      // 4. Draw PCB Circuit Traces & High-Speed Data Pulses
      circuits.forEach((circuit) => {
        if (circuit.points.length < 2) return;

        // Base copper trace
        ctx.beginPath();
        ctx.moveTo(circuit.points[0].x, circuit.points[0].y);
        for (let p = 1; p < circuit.points.length; p++) {
          ctx.lineTo(circuit.points[p].x, circuit.points[p].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Traveling electrical packet along trace
        circuit.pulseProgress = (circuit.pulseProgress + circuit.pulseSpeed) % 1;

        const totalSegments = circuit.points.length - 1;
        const targetSeg = Math.floor(circuit.pulseProgress * totalSegments);
        const segProgress = (circuit.pulseProgress * totalSegments) % 1;

        if (targetSeg < totalSegments) {
          const p1 = circuit.points[targetSeg];
          const p2 = circuit.points[targetSeg + 1];
          const pulseX = p1.x + (p2.x - p1.x) * segProgress;
          const pulseY = p1.y + (p2.y - p1.y) * segProgress;

          // Glowing pulse dot
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = circuit.color;
          ctx.shadowColor = circuit.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 5. Draw interactive mouse electromagnetic ripple if active
      if (mousePos.current.active) {
        const mx = mousePos.current.x;
        const my = mousePos.current.y;

        const rippleGrad = ctx.createRadialGradient(mx, my, 5, mx, my, 120);
        rippleGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
        rippleGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
        rippleGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = rippleGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw drifting particles (energy sparks & LN2 vapor)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife || p.y < -10 || p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.life = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-0">
      
      {/* Background HTML5 Video stream or Canvas Hologram */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      {/* Cyber gradient vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/80 pointer-events-none" />

      {/* Small Floating Animation Controller Badge (top right of banner) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs font-mono shadow-glow-cyan">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className={`w-2 h-2 rounded-full bg-cyan-400 ${isPlaying ? 'animate-ping' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider uppercase">GPU PCB ENGINE</span>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isPlaying ? 'Pause Motion Animation' : 'Play Motion Animation'}
        >
          {isPlaying ? <Pause className="w-3 h-3 text-cyan-300" /> : <Play className="w-3 h-3 text-emerald-400" />}
        </button>
      </div>

    </div>
  );
};
