import { useMemo } from "react";
import dayjs from "dayjs";
import { Transaction } from "../models/Transaction";

export interface DailyTrend {
  date: string; // "M/D" 형식
  count: number;
}

export const useDailyTrends = (transactions: Transaction[]): DailyTrend[] => {
  const trends = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const sortedTx = [...transactions].sort((a, b) =>
      dayjs(a.date).diff(dayjs(b.date))
    );

    const dailyData: { [date: string]: { count: number } } = {};

    sortedTx.forEach((tx) => {
      const date = dayjs(tx.date).format("YYYY-MM-DD");
      if (!dailyData[date]) {
        dailyData[date] = { count: 0 };
      }
      dailyData[date].count += 1;
    });

    const trendData = Object.keys(dailyData)
      .sort((a, b) => dayjs(a).diff(dayjs(b)))
      .map((date) => {
        return {
          date: dayjs(date).format("M/D"),
          count: dailyData[date].count,
        };
      });

    return trendData;
  }, [transactions]);

  return trends;
};
