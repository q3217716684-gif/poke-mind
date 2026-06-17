// 玻璃拟态卡片 - 统一的毛玻璃效果容器
import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={`
        bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl
        ${hover ? "hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-lg hover:shadow-pokemon-blue/5 transition-all duration-300" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(59,76,202,0.1)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
