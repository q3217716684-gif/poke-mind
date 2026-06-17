import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const { deckA, deckB } = await request.json();

    if (!deckA || !deckB) {
      return NextResponse.json({ error: "请提供两套卡组" }, { status: 400 });
    }

    const systemPrompt = `你是一位宝可梦PTCG顶级分析师。用户会给你两套卡组，请从以下角度进行对比分析：

1. **卡组类型对比**：两套卡组的核心策略和获胜思路
2. **优劣势分析**：A 卡组对 B 卡组的优势在哪里，劣势在哪里
3. **关键单卡**：在对局中起决定作用的卡牌
4. **模拟对局**：假设双方正常展开，对战会如何发展
5. **胜率预估**：估算 A 卡组对 B 卡组的胜率（用百分比）
6. **优化建议**：分别给两套卡组提 2-3 条改进建议

请用中文回答，格式清晰，数据具体。`;

    const analysis = await callDeepSeek([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `请对比以下两套PTCG卡组：\n\n【卡组A】\n${deckA}\n\n【卡组B】\n${deckB}`,
      },
    ]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    return NextResponse.json(
      { analysis: `分析失败：${error.message}` },
      { status: 500 }
    );
  }
}
