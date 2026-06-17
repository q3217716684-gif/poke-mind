"use client";

// 动态粒子背景 - 模拟精灵球和能量符号漂浮
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 渐变光晕 */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-pokemon-blue/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pokemon-yellow/5 rounded-full blur-[100px] animate-pulse" />

      {/* 网格背景 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 漂浮精灵球 */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-white/10 w-\[var(--size)\] h-\[var(--size)\]"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
          }}
        >
          <div className="absolute inset-[30%] rounded-full bg-pokemon-blue/10" />
        </div>
      ))}

      {/* 能量符号粒子 */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute text-white/[0.03]"
          style={{
            fontSize: `${12 + Math.random() * 24}px`,
            left: `${Math.random() * 95}%`,
            top: `${Math.random() * 95}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
          }}
        >
          {["⚡", "🔥", "💧", "🌿"][i % 4]}
        </div>
      ))}
    </div>
  );
}
