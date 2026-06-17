// API 预热 — 首次加载时自动拉取热门卡牌缓存
import { NextResponse } from "next/server";

const POKEMON_TCG_API = "https://api.pokemontcg.io/v2";

// 热门宝可梦列表（PTCG 常见卡牌）
const POPULAR_POKEMON = [
  "Charizard VMAX",
  "Pikachu V",
  "Mew VMAX",
  "Arceus VSTAR",
  "Giratina VSTAR",
  "Lugia VSTAR",
  "Gardevoir ex",
  "Chien-Pao ex",
  "Miraidon ex",
  "Charizard ex",
  "Roaring Moon ex",
  "Iron Hands ex",
];

export async function GET() {
  try {
    const allCards: any[] = [];

    // 并行拉取热门卡牌
    const results = await Promise.allSettled(
      POPULAR_POKEMON.map((name) =>
        fetch(
          `${POKEMON_TCG_API}/cards?q=name:${encodeURIComponent(name)}&pageSize=1&select=id,name,supertype,subtypes,types,rarity,images,set`,
          {
            headers: { "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "" },
          }
        ).then((r) => r.json())
      )
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value?.data?.length > 0) {
        allCards.push(result.value.data[0]);
      }
    }

    return NextResponse.json({
      cached: allCards.length,
      cards: allCards,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
