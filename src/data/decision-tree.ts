// PTCG 对战决策树
// 引导玩家在实战中逐步做出最优决策

export interface Choice {
  id: string;
  label: string;
  icon: string;
  nextNode: string;
}

export interface TreeNode {
  id: string;
  question: string;
  description?: string;
  choices: Choice[];
}

export const DECISION_TREE: Record<string, TreeNode> = {
  // === 根节点 ===
  start: {
    id: "start",
    question: "当前处于对战的哪个阶段？",
    description: "不同阶段的策略重点完全不同",
    choices: [
      { id: "early", label: "前期（0-2回合）", icon: "🌅", nextNode: "early_hand" },
      { id: "mid", label: "中期（3-5回合）", icon: "☀️", nextNode: "mid_prize" },
      { id: "late", label: "后期（6回合+）", icon: "🌙", nextNode: "late_prize" },
    ],
  },

  // === 前期分支 ===
  early_hand: {
    id: "early_hand",
    question: "起手有基础宝可梦吗？",
    description: "没有基础宝可梦需要调度（重抽）",
    choices: [
      { id: "has_basic", label: "有，且数量足够（2只以上）", icon: "✅", nextNode: "early_supporter" },
      { id: "one_basic", label: "只有1只", icon: "⚠️", nextNode: "early_search" },
      { id: "no_basic", label: "没有基础宝可梦", icon: "❌", nextNode: "mulligan" },
    ],
  },

  early_search: {
    id: "early_search",
    question: "手上有高级球/先机球吗？",
    choices: [
      { id: "has_ball", label: "有，可以找第二只基础宝可梦", icon: "🟢", nextNode: "early_play_ball" },
      { id: "no_ball", label: "没有检索卡", icon: "🔴", nextNode: "early_supporter" },
    ],
  },

  early_play_ball: {
    id: "early_play_ball",
    question: "找哪只宝可梦？",
    choices: [
      { id: "find_attacker", label: "主力打手（如皮卡丘V）", icon: "⚔️", nextNode: "early_bench" },
      { id: "find_support", label: "辅助宝可梦（用于特性/过牌）", icon: "🛡️", nextNode: "early_bench" },
      { id: "find_both", label: "一只主力 + 一只备用", icon: "🎯", nextNode: "early_bench" },
    ],
  },

  early_supporter: {
    id: "early_supporter",
    question: "手上有支援者卡吗？",
    choices: [
      { id: "has_research", label: "有博士的研究 / 玛俐", icon: "📚", nextNode: "early_draw" },
      { id: "has_other", label: "有其他支援者（熔接工等）", icon: "🔧", nextNode: "early_energy" },
      { id: "no_supporter", label: "没有支援者", icon: "😰", nextNode: "early_energy" },
    ],
  },

  early_draw: {
    id: "early_draw",
    question: "用支援者抽牌还是先做场面？",
    choices: [
      { id: "draw_first", label: "先用支援者过牌再操作", icon: "🃏", nextNode: "early_bench" },
      { id: "bench_first", label: "先铺场再抽牌", icon: "🏟️", nextNode: "early_bench" },
    ],
  },

  early_energy: {
    id: "early_energy",
    question: "这回合需要贴能量吗？",
    choices: [
      { id: "energy_yes", label: "给战斗宝可梦贴能量", icon: "⚡", nextNode: "early_bench" },
      { id: "energy_no", label: "先不贴，等更好的时机", icon: "⏸️", nextNode: "early_bench" },
      { id: "energy_bench", label: "给备战的宝可梦贴", icon: "🔋", nextNode: "early_bench" },
    ],
  },

  early_bench: {
    id: "early_bench",
    question: "备战区还有空位吗？",
    choices: [
      { id: "fill_bench", label: "有，继续铺场", icon: "➕", nextNode: "early_end" },
      { id: "bench_full", label: "满了或够了", icon: "✅", nextNode: "early_end" },
    ],
  },

  early_end: {
    id: "early_end",
    question: "回合结束前，还需要做什么？",
    choices: [
      { id: "attack_now", label: "能攻击就攻击（后手）", icon: "⚔️", nextNode: "result" },
      { id: "pass_turn", label: "铺场完成，结束回合", icon: "🏁", nextNode: "result" },
      { id: "use_item", label: "还有物品卡可以用", icon: "🎒", nextNode: "result" },
    ],
  },

  mulligan: {
    id: "mulligan",
    question: "无基础宝可梦，需要调度重抽",
    description: "将手牌洗回牌库，重新抽7张。对手会额外抽1张作为补偿",
    choices: [
      { id: "do_mulligan", label: "确认调度", icon: "🔄", nextNode: "early_hand" },
      { id: "accept_hand", label: "不调度（不推荐）", icon: "⚠️", nextNode: "early_hand" },
    ],
  },

  // === 中期分支 ===
  mid_prize: {
    id: "mid_prize",
    question: "当前奖赏卡比分如何？",
    choices: [
      { id: "ahead", label: "领先（剩4-6张 vs 对手更多）", icon: "🟢", nextNode: "mid_ahead" },
      { id: "even", label: "均势（双方差不多）", icon: "🟡", nextNode: "mid_board" },
      { id: "behind", label: "落后（对手剩更少）", icon: "🔴", nextNode: "mid_behind" },
    ],
  },

  mid_ahead: {
    id: "mid_ahead",
    question: "领先时应该稳扎稳打，你选择？",
    choices: [
      { id: "keep_pressure", label: "继续施压，扩大优势", icon: "🔥", nextNode: "mid_board" },
      { id: "play_safe", label: "保守运营，保住领先", icon: "🛡️", nextNode: "mid_board" },
    ],
  },

  mid_behind: {
    id: "mid_behind",
    question: "落后时需要寻找翻盘点，你有 boss 指令吗？",
    choices: [
      { id: "has_boss", label: "有，可以把对手关键宝可梦拉到前排", icon: "🎯", nextNode: "mid_board" },
      { id: "no_boss", label: "没有，需要其他策略", icon: "🤔", nextNode: "mid_board" },
    ],
  },

  mid_board: {
    id: "mid_board",
    question: "对手场上的最大威胁是什么？",
    choices: [
      { id: "threat_ready", label: "已充能完毕的强力打手", icon: "💀", nextNode: "mid_handle_threat" },
      { id: "threat_evolving", label: "即将进化的关键宝可梦", icon: "🥚", nextNode: "mid_target_evo" },
      { id: "no_threat", label: "暂时没有明显威胁", icon: "😌", nextNode: "mid_energy_check" },
    ],
  },

  mid_handle_threat: {
    id: "mid_handle_threat",
    question: "如何处理这个威胁？",
    choices: [
      { id: "kill_it", label: "直接击杀（需要伤害够）", icon: "💥", nextNode: "mid_energy_check" },
      { id: "boss_around", label: "用 Boss 指令换走，打别的目标", icon: "🔄", nextNode: "mid_energy_check" },
      { id: "avoid", label: "暂时避开，发育自己的场面", icon: "🏃", nextNode: "mid_energy_check" },
    ],
  },

  mid_target_evo: {
    id: "mid_target_evo",
    question: "能在对手进化前击杀基础宝可梦吗？",
    choices: [
      { id: "can_kill", label: "能，立即击杀阻止进化", icon: "🎯", nextNode: "mid_energy_check" },
      { id: "cant_kill", label: "伤害不够，需要准备应对", icon: "😰", nextNode: "mid_energy_check" },
    ],
  },

  mid_energy_check: {
    id: "mid_energy_check",
    question: "你的主力打手能量够吗？",
    choices: [
      { id: "energy_ready", label: "能量足够，可以攻击", icon: "⚡", nextNode: "mid_attack" },
      { id: "energy_short", label: "还差1-2个能量", icon: "🔋", nextNode: "mid_energy_plan" },
    ],
  },

  mid_energy_plan: {
    id: "mid_energy_plan",
    question: "如何获取能量？",
    choices: [
      { id: "manual_attach", label: "本回合手动贴（等一回合）", icon: "⏰", nextNode: "mid_end" },
      { id: "accel_card", label: "有能量加速卡（熔接工等）", icon: "🚀", nextNode: "mid_end" },
      { id: "retreat_tank", label: "换肉盾上去拖时间", icon: "🛡️", nextNode: "mid_end" },
    ],
  },

  mid_attack: {
    id: "mid_attack",
    question: "攻击目标选择？",
    choices: [
      { id: "kill_threat", label: "击杀对方最大威胁", icon: "🎯", nextNode: "mid_end" },
      { id: "take_prize", label: "击杀能拿奖赏卡的目标", icon: "🏆", nextNode: "mid_end" },
      { id: "chip_damage", label: "先磨血，为后续击杀做准备", icon: "🔪", nextNode: "mid_end" },
    ],
  },

  mid_end: {
    id: "mid_end",
    question: "回合收尾，考虑下一回合",
    choices: [
      { id: "end_turn", label: "结束回合", icon: "🏁", nextNode: "result" },
      { id: "last_item", label: "还有道具可以用", icon: "🎒", nextNode: "result" },
    ],
  },

  // === 后期分支 ===
  late_prize: {
    id: "late_prize",
    question: "后期决胜阶段，你的奖赏卡还剩几张？",
    choices: [
      { id: "late_2", label: "1-2张（马上赢/输）", icon: "⚡", nextNode: "late_checkmate" },
      { id: "late_3", label: "3-4张", icon: "⏳", nextNode: "late_resource" },
    ],
  },

  late_checkmate: {
    id: "late_checkmate",
    question: "这回合能斩杀吗？",
    description: "计算场上伤害是否足够击杀对方宝可梦并拿完奖赏卡",
    choices: [
      { id: "can_win", label: "能！直接拿下", icon: "🏆", nextNode: "result" },
      { id: "need_setup", label: "还差一步，需要先解决某个问题", icon: "🧩", nextNode: "late_resource" },
      { id: "about_to_lose", label: "不能，而且下回合可能被斩杀", icon: "😰", nextNode: "late_survival" },
    ],
  },

  late_survival: {
    id: "late_survival",
    question: "生存策略 — 如何拖一回合？",
    choices: [
      { id: "sack_fodder", label: "牺牲一只无关紧要的宝可梦", icon: "🐑", nextNode: "result" },
      { id: "heal_stall", label: "治疗/肉盾拖延", icon: "💊", nextNode: "result" },
      { id: "deck_out", label: "看对手牌库是否快空了", icon: "📚", nextNode: "result" },
    ],
  },

  late_resource: {
    id: "late_resource",
    question: "牌库还剩多少张？",
    description: "后期牌库枯竭是常见输法",
    choices: [
      { id: "deck_ok", label: "还有很多（10张以上）", icon: "✅", nextNode: "late_push" },
      { id: "deck_low", label: "不多了（5-10张），注意别抽干", icon: "⚠️", nextNode: "late_push" },
      { id: "deck_critical", label: "很少（5张以下），极度危险", icon: "🚨", nextNode: "late_push" },
    ],
  },

  late_push: {
    id: "late_push",
    question: "最后一击策略？",
    choices: [
      { id: "all_in", label: "全力进攻，不管代价", icon: "💥", nextNode: "result" },
      { id: "calculated", label: "精确计算伤害后再出手", icon: "🧮", nextNode: "result" },
      { id: "defend_win", label: "防守反击，等对手犯错", icon: "🏰", nextNode: "result" },
    ],
  },

  // === 结果 ===
  result: {
    id: "result",
    question: "决策路径完成",
    description: "AI 正在根据你的选择生成详细建议...",
    choices: [],
  },
};

// 将用户的选择转换为可读的决策路径
export function getDecisionPath(choices: { nodeId: string; choiceId: string; label: string }[]) {
  return choices.map((c) => ({
    node: DECISION_TREE[c.nodeId],
    selected: c.label,
  }));
}
