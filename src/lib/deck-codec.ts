// PTCG Live 卡组代码解析器
// 支持 PTCGL 官方导出格式

interface ParsedDeck {
  cards: Array<{ name: string; count: number; set: string; number: string }>;
  rawCode: string;
  isValid: boolean;
  error?: string;
}

// PTCGL 卡组代码 → 卡牌列表
// 代码格式: 以特定前缀开头，后跟 base64 编码数据
export async function parseDeckCode(code: string): Promise<ParsedDeck> {
  const trimmed = code.trim();

  // 检测是否是 PTCGL 格式（通常以数字或特定字符开头）
  if (!trimmed || trimmed.length < 4) {
    return { cards: [], rawCode: trimmed, isValid: false, error: "代码太短" };
  }

  try {
    // 方式 1：检测 base64 编码的 PTCGL 格式
    if (/^[A-Za-z0-9+/=]+$/.test(trimmed) && trimmed.length > 10) {
      // 尝试解码
      const cards = decodePTCGLCode(trimmed);
      if (cards.length > 0) {
        return { cards, rawCode: trimmed, isValid: true };
      }
    }
  } catch {
    // 不是 base64 格式，尝试文本解析
  }

  // 方式 2：纯文本格式解析
  const cards = parseTextDeckList(trimmed);
  if (cards.length > 0) {
    return { cards, rawCode: trimmed, isValid: true };
  }

  return {
    cards: [],
    rawCode: trimmed,
    isValid: false,
    error: "无法识别的卡组代码格式",
  };
}

// 解码 PTCGL base64 格式
function decodePTCGLCode(code: string): Array<{ name: string; count: number; set: string; number: string }> {
  try {
    // PTCGL 使用 base64 编码，解码后每 2 字节代表一张卡
    const binary = atob(code);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const cards: Array<{ name: string; count: number; set: string; number: string }> = [];

    // 解析：每 2-3 字节一组 (count, set_index, card_number)
    for (let i = 0; i < bytes.length - 1; i += 2) {
      const count = bytes[i] & 0x0f; // 低 4 位是数量
      if (count === 0 || count > 4) continue;

      const setIdx = bytes[i] >> 4; // 高 4 位是系列索引
      const cardNum = bytes[i + 1]; // 第二字节是卡牌编号

      cards.push({
        count,
        set: `SET${setIdx}`,
        number: String(cardNum),
        name: `Card #${cardNum} (Set ${setIdx})`, // 实际名字需要 API 查
      });
    }

    return cards;
  } catch {
    return [];
  }
}

// 纯文本卡组列表解析
function parseTextDeckList(text: string): Array<{ name: string; count: number; set: string; number: string }> {
  const cards: Array<{ name: string; count: number; set: string; number: string }> = [];
  const lines = text.split(/[\n\r]+/).filter(Boolean);

  for (const line of lines) {
    // 格式: "卡牌名称 ×数量" 或 "数量 卡牌名称 SET 编号"
    const match =
      line.match(/^(.+?)\s*[×xX]\s*(\d+)\s*$/) ||
      line.match(/^(\d+)\s+(.+?)\s*$/);

    if (match) {
      let name: string;
      let count: number;

      if (line.includes("×") || line.includes("x") || line.includes("X")) {
        name = match[1].trim();
        count = parseInt(match[2]);
      } else {
        count = parseInt(match[1]);
        name = match[2].trim();
      }

      if (count > 0 && count <= 60 && name.length > 1) {
        cards.push({ name, count, set: "", number: "" });
      }
    }
  }

  return cards;
}

// 将解析结果转为可读的卡组列表文本
export function formatDeckList(cards: ParsedDeck["cards"]): string {
  return cards.map((c) => `${c.name} ×${c.count}`).join("\n");
}

// 验证卡组合法性
export function validateDeck(cards: ParsedDeck["cards"]): {
  valid: boolean;
  totalCards: number;
  errors: string[];
} {
  const errors: string[] = [];
  const totalCards = cards.reduce((sum, c) => sum + c.count, 0);

  if (totalCards !== 60) {
    errors.push(`卡组共 ${totalCards} 张，标准卡组需要恰好 60 张`);
  }

  // 检查同名卡不超过 4 张（基本能量除外）
  const nameCounts = new Map<string, number>();
  for (const card of cards) {
    const current = nameCounts.get(card.name) || 0;
    nameCounts.set(card.name, current + card.count);
  }

  for (const [name, count] of nameCounts) {
    if (count > 4 && !isBasicEnergy(name)) {
      errors.push(`"${name}" 有 ${count} 张，同名卡最多 4 张`);
    }
  }

  return {
    valid: errors.length === 0,
    totalCards,
    errors,
  };
}

function isBasicEnergy(name: string): boolean {
  const energies = [
    "草能量", "火能量", "水能量", "电能量", "超能量",
    "斗能量", "恶能量", "钢能量", "龙能量",
    "基本草能量", "基本火能量", "基本水能量", "基本电能量",
    "基本超能量", "基本斗能量", "基本恶能量", "基本钢能量",
    "Grass Energy", "Fire Energy", "Water Energy",
    "Lightning Energy", "Psychic Energy", "Fighting Energy",
    "Darkness Energy", "Metal Energy", "Dragon Energy",
  ];
  return energies.some((e) => name.includes(e));
}
