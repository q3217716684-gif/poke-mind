"use client";

import { useEffect, useState } from "react";

// 卡片形状的粒子数据
interface Particle {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  color: string;
  speedX: number;
  speedY: number;
  speedR: number;
  opacity: number;
  delay: number;
}

const COLORS = [
  "rgba(59,76,202,0.12)",   // 蓝
  "rgba(255,222,0,0.10)",   // 黄
  "rgba(255,0,0,0.07)",     // 红
  "rgba(74,222,128,0.08)",  // 绿
  "rgba(168,85,247,0.09)",  // 紫
  "rgba(251,146,60,0.08)",  // 橙
];

function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    w: 60 + Math.random() * 80,
    h: 80 + Math.random() * 110,
    rotation: Math.random() * 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speedX: (Math.random() - 0.5) * 0.015,
    speedY: (Math.random() - 0.5) * 0.01,
    speedR: (Math.random() - 0.5) * 0.03,
    opacity: 0.4 + Math.random() * 0.4,
    delay: Math.random() * 8,
  }));
}

export default function CardBackground() {
  const [particles] = useState<Particle[]>(() => generateParticles());

  useEffect(() => {
    let frame: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const container = document.getElementById("card-bg");
      if (!container) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const cards = container.children;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const p = particles[i];
        if (!p) continue;

        let newX = p.x + p.speedX * dt;
        let newY = p.y + p.speedY * dt;
        let newR = p.rotation + p.speedR * dt;

        if (newX < -10 || newX > 110) p.speedX *= -1;
        if (newY < -10 || newY > 110) p.speedY *= -1;

        p.x = newX;
        p.y = newY;
        p.rotation = newR;

        card.style.left = `${p.x}%`;
        card.style.top = `${p.y}%`;
        card.style.transform = `translate(-50%, -50%) rotate(${p.rotation}deg)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 基底 */}
      <div className="absolute inset-0 bg-[#06060f]" />

      {/* 浮动卡形粒子 */}
      <div id="card-bg" className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-xl border border-white/[0.06] backdrop-blur-[2px]"
            style={{
              width: p.w,
              height: p.h,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.color,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              opacity: p.opacity,
              animation: `fadeInUp 3s ease-out ${p.delay}s both`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* 卡片内部装饰线条 */}
            <div className="absolute inset-2 rounded-lg border border-white/[0.06]" />
            <div className="absolute top-1/3 left-2 right-2 h-[1px] bg-white/[0.06]" />
            <div className="absolute top-1/2 left-2 right-6 h-[1px] bg-white/[0.04]" />
            <div className="absolute top-2/3 left-2 right-10 h-[1px] bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* 渐变光晕 */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-pokemon-blue/[0.02] blur-[150px]" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-pokemon-yellow/[0.02] blur-[150px]" />

      {/* 网格 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
