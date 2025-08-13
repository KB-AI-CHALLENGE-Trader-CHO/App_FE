import { useMemo } from "react";
import dayjs from "dayjs";
import { Transaction } from "../models/transactionDemo";
import { DailyTrend } from "./useDailyTrends";

export const useMonthlyTrends = (Transactions: Transaction[]): DailyTrend[] => {
  return useMemo(() => {
    if (!Array.isArray(Transactions) || Transactions.length === 0) {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}월`,
        count: 0,
        cumulativeProfit: 0,
      }));
    }

    const monthlyData: Record<number, { profit: number; count: number }> = {};

    for (const tx of Transactions) {
      const m = dayjs(tx.date).month(); // 0-11
      if (!monthlyData[m]) monthlyData[m] = { profit: 0, count: 0 };

      // 수익은 sell 시점에서만 확정
      if (tx.type === "sell") {
        const qty = tx.quantity ?? 0;
        const price = tx.price ?? 0;
        const avg = (tx.avgBuyPrice ?? tx.price ?? 0);
        const sellAmount = qty * price;
        const buyAmount = qty * avg;
        monthlyData[m].profit += (sellAmount - buyAmount);
      }

      monthlyData[m].count += 1;
    }

    let cumulativeProfit = 0;
    return Array.from({ length: 12 }, (_, i) => {
      const md = monthlyData[i] ?? { profit: 0, count: 0 };
      cumulativeProfit += md.profit;
      return {
        date: `${i + 1}월`,
        count: md.count,
        cumulativeProfit,
      };
    });
  }, [Transactions]);
};
