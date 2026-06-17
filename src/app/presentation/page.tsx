"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    bg: "bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#1a1a3e]",
    content: (
      <div className="text-center">
        <div className="text-7xl mb-6 float">⚡</div>
        <h1 className="text-6xl font-bold text-gradient mb-4">PokeMind</h1>
        <p className="text-xl text-gray-400 mb-8">
          基于大模型的宝可梦PTCG决策分析平台
        </p>
        <div className="h-px w-32 bg-pokemon-yellow/50 mx-auto mb-8" />
        <p className="text-gray-500">
          大学生创新项目答辩
        </p>
      </div>
    ),
  },
  {
    title: "项目背景",
    content: (
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl shrink-0">🎮</span>
          <div>
            <h3 className="text-white font-semibold mb-1">PTCG 全球热潮</h3>
            <p className="text-gray-400 text-sm">宝可梦集换式卡牌游戏全球玩家超 5000 万，PTCG Live 月活用户持续增长，竞技赛事奖金池达百万美元级别</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl shrink-0">🤔</span>
          <div>
            <h3 className="text-white font-semibold mb-1">玩家痛点</h3>
            <p className="text-gray-400 text-sm">新手入坑门槛高、卡组构筑缺乏指导、对局复盘靠感觉、实时决策缺少参考——传统论坛和攻略无法提供个性化建议</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl shrink-0">🧠</span>
          <div>
            <h3 className="text-white font-semibold mb-1">AI 时代的机遇</h3>
            <p className="text-gray-400 text-sm">大语言模型具备理解游戏规则、分析复杂局面的能力，可以为每位玩家提供专属的决策支持</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "产品概述",
    content: (
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "🃏", title: "卡组分析", desc: "AI 深度解析卡组优缺点\n智能优化建议" },
          { icon: "🔍", title: "对战复盘", desc: "标注关键失误\n生成复盘报告" },
          { icon: "🤖", title: "AI 陪练", desc: "多轮对话指导\n实时决策建议" },
          { icon: "🌳", title: "决策树", desc: "分步引导思考\nAI 综合建议" },
          { icon: "🎲", title: "概率计算", desc: "超几何分布模型\n起手概率预测" },
          { icon: "⚔️", title: "卡组对比", desc: "两套卡组对决\nAI 胜负预测" },
          { icon: "📚", title: "卡牌数据库", desc: "官方 API 实时数据\n中文搜索支持" },
          { icon: "📊", title: "竞技环境", desc: "实时 Meta 数据\nS/A/B 分级体系" },
          { icon: "📡", title: "赛事直播", desc: "60 秒自动刷新\n赛事 Meta 分布" },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center hover:bg-white/[0.06] transition-colors"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-gray-500 text-xs whitespace-pre-line">{f.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "技术架构",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-6 justify-center">
          <div className="bg-pokemon-blue/10 border border-pokemon-blue/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">🖥️</div>
            <p className="text-white font-semibold text-sm">Next.js 14</p>
            <p className="text-gray-500 text-xs mt-1">App Router</p>
            <p className="text-gray-500 text-xs">TypeScript</p>
          </div>
          <span className="text-gray-600 text-2xl">→</span>
          <div className="bg-pokemon-yellow/10 border border-pokemon-yellow/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">🧠</div>
            <p className="text-white font-semibold text-sm">DeepSeek API</p>
            <p className="text-gray-500 text-xs mt-1">大语言模型</p>
            <p className="text-gray-500 text-xs">RAG 增强</p>
          </div>
          <span className="text-gray-600 text-2xl">→</span>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-2xl mb-2">📡</div>
            <p className="text-white font-semibold text-sm">外部数据</p>
            <p className="text-gray-500 text-xs mt-1">Pokémon TCG API</p>
            <p className="text-gray-500 text-xs">Limitless TCG</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-center">技术栈</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 14", "TypeScript", "TailwindCSS", "DeepSeek API",
              "RAG 检索增强生成", "Web Speech API", "Service Worker (PWA)",
              "Pokémon TCG API", "Limitless TCG API", "超几何分布",
              "localStorage", "Markdown 渲染",
            ].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "技术创新 — RAG 检索增强生成",
    content: (
      <div className="space-y-5">
        <div className="bg-pokemon-blue/5 border border-pokemon-blue/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">🏗️ 架构设计</h3>
          <div className="text-center text-sm text-gray-400 font-mono bg-black/30 rounded-lg p-4">
            用户提问 → 关键词检索 → 匹配规则条目 → 注入 System Prompt → DeepSeek 生成回答
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-green-400 font-semibold text-sm mb-2">✅ 优势</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• 回答基于真实规则，减少幻觉</li>
              <li>• 无需微调模型，成本低</li>
              <li>• 知识库可随时扩展</li>
              <li>• 无需向量数据库</li>
            </ul>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <h3 className="text-pokemon-yellow font-semibold text-sm mb-2">📊 效果</h3>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• 内置 8 大规则分类</li>
              <li>• 覆盖全部核心机制</li>
              <li>• 关键词匹配 + 内容检索</li>
              <li>• 自动注入上下文</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "技术创新 — 概率计算器",
    content: (
      <div className="space-y-5">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">🎯 数学模型</h3>
          <div className="text-center">
            <p className="text-lg text-pokemon-yellow font-mono mb-2">
              超几何分布 Hypergeometric Distribution
            </p>
            <p className="text-gray-400 text-sm">
              P(X = k) = C(K,k) × C(N-K, n-k) / C(N,n)
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "卡组总数 N", value: "60" },
            { label: "目标卡数量 K", value: "4" },
            { label: "抽牌数量 n", value: "7 (起手)" },
            { label: "至少抽到 k 张", value: "1" },
          ].map((p) => (
            <div key={p.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs">{p.label}</p>
              <p className="text-white font-semibold">{p.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-300">起手抽到至少 1 张的概率</p>
          <p className="text-3xl font-bold text-green-400">39.9%</p>
        </div>
        <p className="text-xs text-gray-600 text-center">
          支持单卡概率 + 双卡 Combo 模式
        </p>
      </div>
    ),
  },
  {
    title: "技术创新 — 实时数据管道",
    content: (
      <div className="space-y-5">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">📡 数据流架构</h3>
          <div className="text-center text-sm text-gray-400 font-mono bg-black/30 rounded-lg p-4 space-y-1">
            <p>Pokémon TCG API → 服务端缓存 (10min) → 前端展示</p>
            <p>Limitless TCG → 服务端缓存 (60s) → 自动刷新 → 前端展示</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">📚</p>
            <p className="text-white font-semibold text-sm">卡牌数据库</p>
            <p className="text-gray-500 text-xs mt-1">官方实时数据</p>
            <p className="text-gray-500 text-xs">支持中文搜索</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-white font-semibold text-sm">竞技环境</p>
            <p className="text-gray-500 text-xs mt-1">Meta 数据</p>
            <p className="text-gray-500 text-xs">S/A/B 分级</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 text-center">
          支持赛事实时数据流 · 每 60 秒自动刷新
        </p>
      </div>
    ),
  },
  {
    title: "项目亮点总结",
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: "🧠", title: "RAG 知识增强", desc: "检索增强生成，回答基于真实规则而非凭空编造" },
          { icon: "📡", title: "实时数据管道", desc: "多数据源聚合，服务端缓存 + 自动刷新" },
          { icon: "🎲", title: "数学建模", desc: "超几何分布计算概率，双卡 Combo 模式" },
          { icon: "🌳", title: "决策树引擎", desc: "20+ 决策节点，覆盖 PTCG 实战全流程" },
          { icon: "🎤", title: "语音交互", desc: "Web Speech API 语音转文字输入" },
          { icon: "📱", title: "PWA 支持", desc: "可安装到手机/桌面，离线也能用" },
        ].map((h) => (
          <div
            key={h.title}
            className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-pokemon-yellow/30 transition-all"
          >
            <div className="text-3xl mb-3">{h.icon}</div>
            <h3 className="text-white font-semibold mb-1">{h.title}</h3>
            <p className="text-gray-400 text-xs">{h.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "演示流程",
    content: (
      <div className="space-y-3">
        {[
          { step: "1", action: "首页 → 卡组分析", desc: "输入卡组，AI 分析优缺点", time: "1 min" },
          { step: "2", action: "对战复盘", desc: "粘贴对局记录，生成复盘报告", time: "1 min" },
          { step: "3", action: "AI 陪练", desc: "实时对话，展示多轮上下文记忆", time: "1.5 min" },
          { step: "4", action: "决策树", desc: "走一遍决策路径，看 AI 建议", time: "1 min" },
          { step: "5", action: "概率计算", desc: "计算起手概率，展示 Combo 模式", time: "0.5 min" },
          { step: "6", action: "卡牌数据库", desc: "搜索皮卡丘，展示中文搜索", time: "0.5 min" },
          { step: "7", action: "竞技环境 + 赛事直播", desc: "展示实时 Meta 数据", time: "0.5 min" },
        ].map((d) => (
          <div
            key={d.step}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
          >
            <span className="w-8 h-8 rounded-lg bg-pokemon-blue/20 text-pokemon-yellow font-bold text-sm flex items-center justify-center shrink-0">
              {d.step}
            </span>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{d.action}</p>
              <p className="text-gray-500 text-xs">{d.desc}</p>
            </div>
            <span className="text-gray-600 text-xs">{d.time}</span>
          </div>
        ))}
        <div className="bg-pokemon-yellow/10 border border-pokemon-yellow/30 rounded-xl p-4 text-center">
          <p className="text-pokemon-yellow font-semibold">⏱️ 总计约 6 分钟</p>
        </div>
      </div>
    ),
  },
  {
    title: "未来展望",
    content: (
      <div className="space-y-4">
        {[
          { icon: "🔬", title: "模型微调", desc: "使用 PTCG 领域数据 Fine-tune，进一步提升回答质量" },
          { icon: "🌐", title: "社区生态", desc: "卡组分享、投票排行、评论互动——构建玩家社区" },
          { icon: "📈", title: "数据可视化", desc: "胜率趋势、Meta 演变图表、个人成长曲线" },
          { icon: "🤖", title: "AI 对局模拟", desc: "两套卡组 AI 自主对战，预测胜负和关键回合" },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.08] rounded-xl p-5"
          >
            <span className="text-3xl shrink-0">{f.icon}</span>
            <div>
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: "bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#1a1a3e]",
    content: (
      <div className="text-center">
        <div className="text-7xl mb-6">⚡</div>
        <h1 className="text-4xl font-bold text-gradient mb-4">谢谢！</h1>
        <p className="text-gray-400 mb-8">PokeMind · 宝可梦PTCG决策分析平台</p>
        <div className="h-px w-32 bg-pokemon-yellow/50 mx-auto mb-8" />
        <div className="text-sm text-gray-500 space-y-1">
          <p>技术栈：Next.js + TypeScript + TailwindCSS + DeepSeek API</p>
          <p>数据来源：Pokémon TCG 官方 API · Limitless TCG</p>
          <p>大学生创新项目</p>
        </div>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goTo = useCallback(
    (delta: number) => {
      setCurrent((prev) => Math.max(0, Math.min(slides.length - 1, prev + delta)));
    },
    []
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goTo(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(-1);
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo]);

  const slide = slides[current];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 md:p-16 transition-colors duration-500 ${slide.bg || "bg-[#08080f]"}`}
    >
      {/* 页码指示器 */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${
              i === current ? "w-8 bg-pokemon-yellow" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* 幻灯片内容 */}
      <div className="max-w-4xl w-full animate-fade-in-up" key={current}>
        {slide.title && (
          <h2 className="text-3xl font-bold text-gradient mb-8 text-center">
            {slide.title}
          </h2>
        )}
        {slide.content}
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-sm text-gray-600">
        <button
          onClick={() => goTo(-1)}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
        >
          ← 上一页
        </button>
        <span className="text-xs">
          {current + 1} / {slides.length}
        </span>
        <button
          onClick={() => goTo(1)}
          disabled={current === slides.length - 1}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition"
        >
          下一页 →
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition"
          title="按 F 键全屏"
        >
          {isFullscreen ? "退出全屏" : "⛶ 全屏"}
        </button>
      </div>

      {/* 提示 */}
      {current === 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 text-xs text-gray-600 animate-pulse">
          按 → 或 空格键 开始演示 · 按 F 全屏
        </div>
      )}
    </div>
  );
}
