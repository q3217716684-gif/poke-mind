import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { buildRAGPrompt } from "@/lib/knowledge-base";

export async function POST(request: NextRequest) {
  try {
    const { deckList } = await request.json();

    if (!deckList || typeof deckList !== "string") {
      return NextResponse.json(
        { error: "请提供卡组列表" },
        { status: 400 }
      );
    }

    const basePrompt = `你是一位宝可梦PTCG（宝可梦集换式卡牌游戏）顶级玩家和卡组分析专家。
用户会给你一份卡组列表，请你从以下角度进行分析：

1. **卡组定位**：这套卡组是什么类型（速攻/控制/连击/能量加速等），在当前环境中的强度
2. **优点分析**：卡组的主要优势、combo 联动点
3. **缺点分析**：卡组的短板、容易被哪些卡组克制
4. **优化建议**：可以替换哪些卡牌来提升强度（具体卡牌名称）
5. **对局思路**：面对主流卡组时的大致策略

请用中文回答，分点列出，语言清晰易懂。`;

    const systemPrompt = buildRAGPrompt(deckList, basePrompt);

    const analysis = await callDeepSeek([
      { role: "system", content: systemPrompt },
      { role: "user", content: `请分析以下PTCG卡组：\n\n${deckList}` },
    ]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("卡组分析失败:", error);
    return NextResponse.json(
      { analysis: `分析失败：${error.message || "未知错误"}` },
      { status: 500 }
    );
  }
}
