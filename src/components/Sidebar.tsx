"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "⚡", label: "首页" },
  { href: "/deck-analysis", icon: "🃏", label: "卡组分析" },
  { href: "/battle-review", icon: "🔍", label: "对战复盘" },
  { href: "/ai-practice", icon: "🤖", label: "AI 陪练" },
];

// 工具页
const toolItems = [
  { href: "/decision-tree", icon: "🌳", label: "决策树" },
  { href: "/deck-compare", icon: "⚔️", label: "卡组对比" },
  { href: "/probability", icon: "🎲", label: "概率计算" },
  { href: "/card-database", icon: "📚", label: "卡牌数据库" },
  { href: "/stats", icon: "📊", label: "竞技环境" },
  { href: "/live", icon: "📡", label: "赛事直播" },
  { href: "/favorites", icon: "⭐", label: "我的收藏" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* 桌面端 - 侧边栏 */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/10 bg-white/[0.02] min-h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <Link href="/" className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-lg font-bold text-pokemon-yellow">
              PokeMind
            </span>
          </div>
        </Link>

        {/* 导航链接 */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-pokemon-blue/20 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pokemon-yellow" />
                )}
              </Link>
            );
          })}

          {/* 工具分组分隔线 */}
          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="px-3 text-[10px] text-gray-600 uppercase tracking-wider mb-1">
              工具
            </p>
          </div>

          {toolItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-pokemon-blue/20 text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pokemon-yellow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-gray-500">
            Powered by DeepSeek
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            大学生创新项目
          </p>
        </div>
      </aside>

      {/* 手机端 - 底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f1a]/95 backdrop-blur border-t border-white/10 z-40">
        <div className="flex justify-around px-1 py-2">
          {[...navItems, ...toolItems].map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-[10px] transition ${
                  isActive ? "text-pokemon-yellow" : "text-gray-500"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate max-w-[48px] text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
