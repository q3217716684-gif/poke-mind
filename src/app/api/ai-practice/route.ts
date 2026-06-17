import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { buildRAGPrompt } from "@/lib/knowledge-base";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "请提供对话消息" },
        { status: 400 }
      );
    }

    const basePrompt = `你是一位宝可梦PTCG职业选手，正在指导一名玩家进行对战。你会收到一系列对话消息，包括用户描述的当前局面。
请你根据上下文，像一个场边的军师一样，给出具体的战术建议。

注意：
- 结合之前的对话历史，给出连贯的建议
- 如果用户追问，要针对性地深入解答
- 分析要具体，提到实际的卡牌名称和操作
- 如果用户的打法有问题，温和地指出并给出更好的方案
- 条理清晰，但不要太啰嗦

请用中文回答。`;

    // RAG：根据用户最后一条消息检索相关规则
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userQuery = lastUserMsg?.content || "";
    const systemPrompt = buildRAGPrompt(userQuery, basePrompt);

    const analysis = await callDeepSeek([
      { role: "system", content: systemPrompt },
      ...messages,
    ]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("AI陪练请求失败:", error);
    return NextResponse.json(
      { analysis: `请求失败：${error.message || "未知错误"}` },
      { status: 500 }
    );
  }
}
