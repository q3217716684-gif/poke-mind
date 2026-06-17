// 卡组收藏夹 Hook — localStorage 持久化
"use client";

import { useState, useCallback, useEffect } from "react";

export interface FavoriteDeck {
  id: string;
  name: string;
  deckList: string;
  analysis?: string;
  createdAt: string;
  tags: string[];
}

const FAVORITES_KEY = "pokemind-favorites";

function loadFavorites(): FavoriteDeck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteDeck[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const save = useCallback(
    (deck: Omit<FavoriteDeck, "id" | "createdAt">) => {
      const newDeck: FavoriteDeck = {
        ...deck,
        id: Date.now().toString(36),
        createdAt: new Date().toISOString(),
      };
      const updated = [newDeck, ...loadFavorites()].slice(0, 50); // 最多 50 套
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
      return newDeck;
    },
    []
  );

  const remove = useCallback((id: string) => {
    const updated = loadFavorites().filter((d) => d.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setFavorites(updated);
  }, []);

  const getById = useCallback((id: string) => {
    return loadFavorites().find((d) => d.id === id) || null;
  }, []);

  const reload = useCallback(() => {
    setFavorites(loadFavorites());
  }, []);

  return { favorites, save, remove, getById, reload };
}

