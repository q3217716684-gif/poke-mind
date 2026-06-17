import { NextRequest, NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/knowledge-base";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = searchKnowledge(query);

  return NextResponse.json({
    query,
    results: results.map((r) => ({
      topic: r.topic,
      content: r.content,
      keywords: r.keywords,
    })),
  });
}
