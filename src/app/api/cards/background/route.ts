import { NextResponse } from "next/server";

const POKEMON_TCG_API = "https://api.pokemontcg.io/v2";

// 50 张热门代表卡牌
const HOT_CARDS = [
  "Charizard VMAX", "Pikachu VMAX", "Mewtwo VSTAR", "Rayquaza VMAX",
  "Arceus VSTAR", "Giratina VSTAR", "Lugia VSTAR", "Mew VMAX",
  "Charizard ex", "Gardevoir ex", "Miraidon ex", "Chien-Pao ex",
  "Roaring Moon ex", "Iron Hands ex", "Raging Bolt ex", "Gholdengo ex",
  "Eevee VMAX", "Umbreon VMAX", "Sylveon VMAX", "Dragapult VMAX",
  "Pikachu ex", "Blastoise ex", "Venusaur ex", "Zacian V",
  "Zamazenta V", "Eternatus VMAX", "Ice Rider Calyrex VMAX",
  "Shadow Rider Calyrex VMAX", "Origin Forme Palkia VSTAR",
  "Origin Forme Dialga VSTAR", "Hisuian Zoroark VSTAR",
  "Regidrago VSTAR", "Snorlax VMAX", "Gengar VMAX", "Espeon VMAX",
  "Glaceon VMAX", "Leafeon VMAX", "Darkrai VSTAR", "Serperior VSTAR",
  "Reshiram V", "Zekrom V", "Kyurem VMAX", "Moltres V", "Articuno V",
  "Zapdos V", "Mew ex", "Ceruledge ex", "Dragonite V", "Tyranitar V",
  "Machamp VMAX", "Corviknight VMAX",
];

// 缓存 24 小时
let cache: { images: string[]; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < 24 * 60 * 60 * 1000) {
    return NextResponse.json({ images: cache.images });
  }

  try {
    const results = await Promise.allSettled(
      HOT_CARDS.map((name) =>
        fetch(
          `${POKEMON_TCG_API}/cards?q=name:${encodeURIComponent(name)}&pageSize=1&select=images`,
          { headers: { "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "" } }
        ).then((r) => r.json())
      )
    );

    const images: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled" && result.value?.data?.[0]?.images?.large) {
        images.push(result.value.data[0].images.large);
      }
    }

    cache = { images, timestamp: Date.now() };
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
