import { useMemo } from "react";
import dayjs from "dayjs";
import { Transaction } from "../models/Transaction";
import {
  DateRangeType,
  SelectedPeriod,
  getStartAndEndDate,
} from "../utils/dateUtils";

type TransactionsData = Record<string, Transaction[]>;

export const useFilteredTransactions = (
  allTransactions: TransactionsData,
  rangeType: DateRangeType,
  period: SelectedPeriod
): Transaction[] => {
  return useMemo(() => {
    if (!period.year) {
      return [];
    }

    const { start, end } = getStartAndEndDate(rangeType, period);

    const filtered: Transaction[] = [];

    for (const date in allTransactions) {
      if (dayjs(date).isBetween(start, end, null, "[]")) {
        filtered.push(...allTransactions[date]);
      }
    }

    return filtered;
  }, [allTransactions, rangeType, period]);
};
