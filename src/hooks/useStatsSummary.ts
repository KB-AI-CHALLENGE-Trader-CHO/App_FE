import { useMemo } from "react";
import { Transaction } from "../models/Transaction";

export interface StatsSummary {
  totalBuy: number;
  totalSell: number;
  realizedProfit: number;
  returnRate: number;
  transactionCount: number;
}

export const useStatsSummary = (transactions: Transaction[]): StatsSummary => {
  return useMemo(() => {
    let totalBuy = 0;
    let totalSell = 0;
    let totalPurchaseCostForSoldItems = 0;

    transactions.forEach((tx) => {
      if (tx.type === "buy") {
        totalBuy += tx.quantity * tx.price;
      } else {
        totalSell += tx.quantity * tx.price;
        // avgBuyPrice is the average purchase price for the sold units
        if (tx.avgBuyPrice) {
          totalPurchaseCostForSoldItems += tx.quantity * tx.avgBuyPrice;
        }
      }
    });

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
      transactionCount: transactions.length,
    };
  }, [transactions]);
};
