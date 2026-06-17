import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { buildRAGPrompt } from "@/lib/knowledge-base";

export async function POST(request: NextRequest) {
  try {
    const { decisions } = await request.json();

    if (!decisions || !Array.isArray(decisions)) {
      return NextResponse.json({ error: "请提供决策路径" }, { status: 400 });
    }

    const basePrompt = `你是一位宝可梦PTCG职业选手兼教练。用户刚刚通过决策树分析了当前对战局面，以下是他们的决策路径。请根据这些选择，给出综合性的战术建议：

1. **决策总结**：概括用户当前的选择意味着什么局面
2. **最优行动**：基于整个决策路径，当前最应该做什么
3. **备选方案**：如果最优行动不可行，还有什么 Plan B
4. **下回合预判**：对手可能会怎么应对，提前准备什么
5. **关键提醒**：1-2 条最重要的注意事项

请用中文回答，像一个教练在场上指导。`;

    const decisionText = decisions
      .map((d: any, i: number) => `第${i + 1}步：${d.question}\n选择：${d.answer}`)
      .join("\n\n");

    const systemPrompt = buildRAGPrompt(decisionText, basePrompt);

    const analysis = await callDeepSeek([
      { role: "system", content: systemPrompt },
      { role: "user", content: `以下是我在决策树中的选择：\n\n${decisionText}\n\n请给我综合建议。` },
    ]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    return NextResponse.json(
      { analysis: `生成建议失败：${error.message}` },
      { status: 500 }
    );
  }
}
