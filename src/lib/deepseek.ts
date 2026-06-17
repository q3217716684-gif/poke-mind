// DeepSeek API 工具函数
// DeepSeek API 兼容 OpenAI SDK 格式

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callDeepSeek(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("请在 .env.local 中设置 DEEPSEEK_API_KEY");
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API 错误 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "未获取到回复";
}
