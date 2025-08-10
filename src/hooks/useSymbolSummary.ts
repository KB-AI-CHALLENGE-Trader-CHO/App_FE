import { useMemo } from "react";
import { Transaction } from "../models/Transaction";

export interface SymbolSummary {
  name: string;
  profit: number;
}

export const useSymbolSummary = (
  transactions: Transaction[]
): SymbolSummary[] => {
  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const symbolData: {
      [name: string]: { buy: number; sell: number; count: number };
    } = {};

    transactions.forEach((tx) => {
      if (!tx.name) return;
      const name = tx.name;
      if (!symbolData[name]) {
        symbolData[name] = { buy: 0, sell: 0, count: 0 };
      }

      const amount = tx.price * tx.quantity;
      if (tx.type === "buy") {
        symbolData[name].buy += amount;
      } else {
        symbolData[name].sell += amount;
      }
      symbolData[name].count += 1;
    });

    const unsortedSummary = Object.keys(symbolData).map((name) => ({
      name,
      profit: symbolData[name].sell - symbolData[name].buy,
      count: symbolData[name].count,
    }));

    const top3MostTraded = unsortedSummary
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const finalSummary: SymbolSummary[] = top3MostTraded.map(
      ({ name, profit }) => ({ name, profit })
    );

    return finalSummary.sort((a, b) => b.profit - a.profit);
  }, [transactions]);

  return summary;
};
