// PTCG 规则知识库 — 用于 RAG 检索增强生成
// 涵盖核心规则、常见判定、对战机制

export interface KnowledgeEntry {
  topic: string;
  content: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    topic: "基本规则",
    content: `宝可梦PTCG基本规则：
- 每套卡组必须恰好60张卡牌，同名卡（除基本能量）最多4张
- 开局各抽7张手牌，可以调度一次（将手牌洗回卡组重抽，对手多抽1张）
- 放置1只基础宝可梦到战斗场，最多5只到备战区
- 放置6张奖赏卡，每击杀对手一只宝可梦获得对应数量的奖赏卡
- 先手玩家不能攻击，不能使用支援者卡
- 获胜条件：拿完6张奖赏卡，或对手场上无宝可梦，或对手无牌可抽`,
    keywords: ["规则", "基础", "开局", "胜利条件", "卡组构成"],
  },
  {
    topic: "宝可梦类型",
    content: `宝可梦卡牌分类：
- 基础宝可梦：可以直接放到场上，卡面标注"基础"
- 1阶进化：必须放在对应基础宝可梦上，标注"从XX进化"
- 2阶进化：必须放在对应1阶进化宝可梦上
- V宝可梦：强力基础宝可梦，被击杀给2张奖赏卡
- VSTAR：从V宝可梦进化，被击杀给2张奖赏卡，一局只能用1次VSTAR力量
- VMAX：从V宝可梦进化，被击杀给3张奖赏卡
- ex宝可梦：新一代强力宝可梦，基础或进化都有，被击杀给2张奖赏卡`,
    keywords: ["宝可梦", "进化", "V", "VSTAR", "VMAX", "ex"],
  },
  {
    topic: "能量卡",
    content: `能量卡规则：
- 基本能量：草、火、水、电、超、斗、恶、钢、龙（无妖精）
- 特殊能量：有额外效果的能量卡，如双无色能量提供2个无色能量
- 每回合只能手动贴1张能量卡（使用技能可以额外贴）
- 能量用于支付宝可梦的攻击费用和撤退费用
- 能量贴在宝可梦身上，宝可梦被击杀时能量丢弃`,
    keywords: ["能量", "基本能量", "特殊能量", "贴能量"],
  },
  {
    topic: "训练家卡",
    content: `训练家卡分为三类：
- 物品卡：一回合可以用任意张，如"高级球"、"宝可梦交替"
- 支援者卡：一回合只能用1张，通常是强大的抽滤效果，如"博士的研究"（弃掉手牌抽7张）、"玛俐"（双方将手牌洗入牌库底）
- 竞技场卡：场上同时只能有1张，提供全局效果，如"巨大炉灶"（每回合弃1张手牌从卡组找2张火能量）
- 物品卡中可以包含"宝可梦道具"子类型，每只宝可梦最多装备1个`,
    keywords: ["训练家", "物品", "支援者", "竞技场", "道具"],
  },
  {
    topic: "异常状态",
    content: `宝可梦异常状态：
- 中毒：每回合检测阶段放1个伤害指示物（10点伤害）
- 灼伤：每回合检测阶段放2个伤害指示物，然后抛硬币，正面则治愈
- 睡眠：宝可梦不能攻击或撤退，每回合抛硬币，正面治愈
- 麻痹：宝可梦不能攻击或撤退，下一个回合结束自动治愈
- 混乱：攻击前抛硬币，反面则攻击失败并对自己放3个伤害指示物
- 进化或退场时所有异常状态清除`,
    keywords: ["异常状态", "中毒", "灼伤", "睡眠", "麻痹", "混乱"],
  },
  {
    topic: "弱点与抗性",
    content: `弱点与抗性机制：
- 弱点：攻击方的属性对应防守方的弱点属性时，伤害×2
- 抗性：攻击方的属性对应防守方的抗性属性时，伤害减少（通常-20或-30）
- 常见克制关系：火克草、草克水、水克火、电克水、斗克恶、超克斗
- V/VMAX/VSTAR/ex宝可梦通常有更高的弱点和抗性倍率`,
    keywords: ["弱点", "抗性", "克制", "属性相克"],
  },
  {
    topic: "撤退与换位",
    content: `撤退与换位规则：
- 撤退费用标注在卡牌右下角，支付对应能量并弃掉后可以撤退
- 撤退后，从备战区选择一只宝可梦移到战斗场
- 异常状态（睡眠、麻痹）不能撤退
- "宝可梦交替"等卡牌可以直接换位，不支付撤退费用，异常状态也能换`,
    keywords: ["撤退", "换位", "交替"],
  },
  {
    topic: "判定与随机",
    content: `PTCG中的随机判定：
- 抛硬币：判定攻击附加效果、异常状态恢复等
- 正面（Heads）/反面（Tails）各50%概率
- 没有骰子机制，所有随机判定都是抛硬币
- 一些卡牌可以操纵硬币结果，如"讲究头带"`,
    keywords: ["硬币", "抛硬币", "随机", "判定"],
  },
];

// 简单关键词检索（模拟向量检索）
export function searchKnowledge(query: string, topK = 3): KnowledgeEntry[] {
  const lowerQuery = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((entry) => {
    let score = 0;
    // 关键词匹配
    for (const kw of entry.keywords) {
      if (lowerQuery.includes(kw)) score += 3;
    }
    // 主题匹配
    if (lowerQuery.includes(entry.topic)) score += 5;
    // 内容匹配
    const contentLower = entry.content.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    for (const word of words) {
      if (word.length >= 2 && contentLower.includes(word)) score += 1;
    }
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.entry);
}

// 生成 RAG 增强的 system prompt
export function buildRAGPrompt(userQuery: string, baseSystemPrompt: string): string {
  const relevantKnowledge = searchKnowledge(userQuery);

  if (relevantKnowledge.length === 0) return baseSystemPrompt;

  const knowledgeText = relevantKnowledge
    .map((k) => `【${k.topic}】${k.content}`)
    .join("\n\n");

  return `${baseSystemPrompt}

---
以下是与当前问题相关的PTCG官方规则参考资料，请在回答时参考这些规则确保准确性：

${knowledgeText}

---
请在参考上述规则的基础上，结合你的PTCG知识进行回答。如果参考规则与问题无关，可以忽略。`;
}
