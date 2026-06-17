import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const { battleLog } = await request.json();

    if (!battleLog || typeof battleLog !== "string") {
      return NextResponse.json(
        { error: "请提供对战记录" },
        { status: 400 }
      );
    }

    const systemPrompt = `你是一位宝可梦PTCG顶级教练，擅长复盘分析对局。用户会给你一场对战的记录，请你进行详细复盘：

1. **关键回合回顾**：标注对战中的关键转折点
2. **失误分析**：指出用户在哪些回合犯了什么错误，为什么是错误的
3. **正确打法**：在这些关键时刻，应该如何操作更优
4. **全局评价**：整体评价用户的表现（进攻节奏、资源管理、场面判断）
5. **改进建议**：针对暴露出的问题，给出具体的练习建议

请用中文回答，语气像一位耐心的教练。`;

    const analysis = await callDeepSeek([
      { role: "system", content: systemPrompt },
      { role: "user", content: `请复盘以下PTCG对战：\n\n${battleLog}` },
    ]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("复盘分析失败:", error);
    return NextResponse.json(
      { analysis: `复盘失败：${error.message || "未知错误"}` },
      { status: 500 }
    );
  }
}
