import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <section className="px-8 pt-20 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">⚡</span>
            <h1 className="text-5xl font-bold text-pokemon-yellow">PokeMind</h1>
          </div>
          <p className="text-xl text-gray-400 mb-4">
            基于大模型的宝可梦PTCG决策分析平台
          </p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            结合 DeepSeek 大语言模型，为宝可梦集换式卡牌游戏（PTCG）玩家
            提供智能卡组分析、对战复盘和AI实时陪练
          </p>
        </div>
      </section>

      {/* 三大功能 */}
      <section className="px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link
            href="/deck-analysis"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all"
          >
            <div className="text-4xl mb-4">🃏</div>
            <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-pokemon-yellow transition">
              卡组分析
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              输入卡组列表，AI 从环境强度、combo 联动、弱点克制等角度深度分析，给出具体优化建议。
            </p>
            <span className="text-pokemon-yellow text-sm opacity-0 group-hover:opacity-100 transition">
              开始使用 →
            </span>
          </Link>

          <Link
            href="/battle-review"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-pokemon-yellow transition">
              对战复盘
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              输入对战记录，AI 标注关键回合、分析失误原因、给出正确打法，像教练一样帮你进步。
            </p>
            <span className="text-pokemon-yellow text-sm opacity-0 group-hover:opacity-100 transition">
              开始使用 →
            </span>
          </Link>

          <Link
            href="/ai-practice"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-pokemon-yellow/50 transition-all"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-pokemon-yellow transition">
              AI 陪练
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              多轮对话式对战指导，实时分析局面、推荐最优决策，支持上下文追问，像职业选手在身边。
            </p>
            <span className="text-pokemon-yellow text-sm opacity-0 group-hover:opacity-100 transition">
              开始使用 →
            </span>
          </Link>
        </div>
      </section>

      {/* 项目亮点 */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            项目亮点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🧠", title: "大模型驱动", desc: "基于 DeepSeek，深入理解 PTCG 规则与策略" },
              { icon: "💬", title: "多轮对话", desc: "AI 陪练支持上下文记忆，可连续追问" },
              { icon: "📝", title: "Markdown 渲染", desc: "AI 回复结构化展示，层次分明易读" },
              { icon: "💾", title: "本地持久化", desc: "聊天记录自动保存，刷新不丢失" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1.5 text-sm">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="px-8 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">技术栈</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14",
              "TypeScript",
              "TailwindCSS",
              "DeepSeek API",
              "React Markdown",
              "LocalStorage",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-white/5 px-8 py-6 text-center">
        <p className="text-gray-600 text-xs">
          PokeMind · 大学生创新项目 · Powered by DeepSeek
        </p>
      </footer>
    </main>
  );
}
