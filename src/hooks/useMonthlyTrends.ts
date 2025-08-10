import { useMemo } from "react";
import dayjs from "dayjs";
import { Transaction } from "../models/Transaction";
import { DailyTrend } from "./useDailyTrends";

export const useMonthlyTrends = (transactions: Transaction[]): DailyTrend[] => {
  const trends = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1}월`,
        count: 0,
        cumulativeProfit: 0,
      }));
    }

    const monthlyData: { [month: number]: { profit: number; count: number } } =
      {};

    transactions.forEach((tx) => {
      const month = dayjs(tx.date).month(); // 0-11
      if (!monthlyData[month]) {
        monthlyData[month] = { profit: 0, count: 0 };
      }

      if (tx.type === "sell") {
        const sellAmount = tx.price * tx.quantity;
        const buyAmount = (tx.avgBuyPrice ?? tx.price) * tx.quantity;
        monthlyData[month].profit += sellAmount - buyAmount;
      }
      monthlyData[month].count += 1;
    });

    let cumulativeProfit = 0;
    const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyData[i] || { profit: 0, count: 0 };
      cumulativeProfit += monthData.profit;

      return {
        date: `${i + 1}월`,
        count: monthData.count,
        cumulativeProfit,
      };
    });

    return monthlyTrends;
  }, [transactions]);

  return trends;
};
