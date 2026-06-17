import { NextRequest, NextResponse } from "next/server";
import { translateQuery } from "@/data/pokemon-names";

const POKEMON_TCG_API = "https://api.pokemontcg.io/v2";

// 内存缓存 — 10 分钟 TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  if (cache.size > 200) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "60"), 60);

  const cacheKey = `cards:${query}:${page}:${pageSize}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    let url: string;

    if (query.trim()) {
      const translated = translateQuery(query);
      const searchTerm = encodeURIComponent(translated);
      url = `${POKEMON_TCG_API}/cards?q=name:*${searchTerm}*&page=${page}&pageSize=${pageSize}&orderBy=name&select=id,name,supertype,subtypes,types,rarity,images,set,tcgplayer`;
    } else {
      url = `${POKEMON_TCG_API}/cards?q=supertype:pokémon&page=${page}&pageSize=${pageSize}&orderBy=name&select=id,name,supertype,subtypes,types,rarity,images,set,tcgplayer`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "",
      },
      signal: controller.signal,
      next: { revalidate: 600 },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    const result = {
      cards: data.data || [],
      total: data.totalCount || 0,
      page,
      pageSize,
      hasMore: data.data?.length === pageSize,
    };

    setCache(cacheKey, result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Card API error:", error);
    return NextResponse.json(
      { error: `获取卡牌数据失败：${error.message}` },
      { status: 500 }
    );
  }
}
