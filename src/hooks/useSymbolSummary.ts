// src/hooks/useSymbolSummary.ts
import { useMemo } from "react";
import { Trade } from "../types/trade";

export interface SymbolSummary {
  name: string;
  profit: number;
}

export const useSymbolSummary = (Trades: Trade[]): SymbolSummary[] => {
  const summary = useMemo(() => {
    if (!Trades || Trades.length === 0) return [];

    const symbolData: Record<string, { buy: number; sell: number; count: number }> = {};

    Trades.forEach((tx) => {
      if (!tx?.name) return;
      const name = tx.name;
      if (!symbolData[name]) symbolData[name] = { buy: 0, sell: 0, count: 0 };

      const price = tx.price ?? 0;
      const qty = tx.quantity ?? 0;
      const amount = price * qty;

      if (tx.type === "BUY") {
        symbolData[name].buy += amount;
      } else {
        symbolData[name].sell += amount;
      }
      symbolData[name].count += 1;
    });

    const unsorted = Object.keys(symbolData).map((name) => ({
      name,
      profit: symbolData[name].sell - symbolData[name].buy,
      count: symbolData[name].count,
    }));

    const top3MostTraded = unsorted.sort((a, b) => b.count - a.count).slice(0, 3);

    return top3MostTraded
      .map(({ name, profit }) => ({ name, profit }))
      .sort((a, b) => b.profit - a.profit);
  }, [Trades]);

  return summary;
};
