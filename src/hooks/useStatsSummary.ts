import { useMemo } from "react";
import { Transaction } from "../models/transactionDemo";

export interface StatsSummary {
  totalBuy: number;
  totalSell: number;
  realizedProfit: number;
  returnRate: number;
  TransactionCount: number;
}

export const useStatsSummary = (Transactions: Transaction[]): StatsSummary => {
  return useMemo(() => {
    if (!Array.isArray(Transactions) || Transactions.length === 0) {
      return { totalBuy: 0, totalSell: 0, realizedProfit: 0, returnRate: 0, TransactionCount: 0 };
    }

    let totalBuy = 0;
    let totalSell = 0;
    let totalPurchaseCostForSoldItems = 0;

    for (const tx of Transactions) {
      const qty = tx.quantity ?? 0;
      const price = tx.price ?? 0;

      if (tx.type === "buy") {
        totalBuy += qty * price;
      } else if (tx.type === "sell") {
        totalSell += qty * price;

        const avg = tx.avgBuyPrice;
        if (avg != null) {
          totalPurchaseCostForSoldItems += qty * avg;
        }
      }
    }

    const realizedProfit = totalSell - totalPurchaseCostForSoldItems;
    const returnRate =
      totalPurchaseCostForSoldItems > 0
        ? (realizedProfit / totalPurchaseCostForSoldItems) * 100
        : 0;

    return {
      totalBuy,
      totalSell,
      realizedProfit,
      returnRate,
      TransactionCount: Transactions.length,
    };
  }, [Transactions]);
};
