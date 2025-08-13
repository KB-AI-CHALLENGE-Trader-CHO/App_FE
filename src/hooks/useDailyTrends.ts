import { useMemo } from "react";
import dayjs from "dayjs";
import { Transaction } from "../models/transactionDemo"; // Assuming Transaction is defined in models/TransactionDemo

export interface DailyTrend {
  date: string; // "M/D" 형식
  count: number;
}

export const useDailyTrends = (Transactions: Transaction[]): DailyTrend[] => {
  const trends = useMemo(() => {
    if (!Transactions || Transactions.length === 0) {
      return [];
    }

    const sortedTx = [...Transactions].sort((a, b) =>
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
  }, [Transactions]);

  return trends;
};
