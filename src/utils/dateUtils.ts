import dayjs from "dayjs";
import "./dayjsConfig"; // Ensure plugins are loaded
import { Trade } from "../types/trade";

// NOTE: dayjs.extend calls are in dayjsConfig.ts
// We import the types here to make TypeScript aware of the extended methods.
import "dayjs/plugin/isBetween";
import "dayjs/plugin/weekOfYear";
import "dayjs/plugin/isoWeek";

export type DateRangeType = "week" | "month" | "year";

export interface SelectedPeriod {
  year: number;
  month: number; // 1-12
  week?: number; // 1-53 (ISO week)
}

export const getStartAndEndDate = (
  rangeType: DateRangeType,
  period: SelectedPeriod
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const { year, month, week } = period;
  let date = dayjs().year(year);

  switch (rangeType) {
    case "week":
      // Set week if provided, otherwise it defaults to the week of 'today' in the selected year
      if (week) {
        date = date.isoWeek(week);
      }
      return {
        start: date.startOf("isoWeek"),
        end: date.endOf("isoWeek"),
      };
    case "month":
      // Set month if provided, otherwise it defaults to the month of 'today' in the selected year
      if (month) {
        date = date.month(month - 1); // dayjs months are 0-indexed
      }
      return {
        start: date.startOf("month"),
        end: date.endOf("month"),
      };
    case "year":
      return {
        start: date.startOf("year"),
        end: date.endOf("year"),
      };
  }
};

export const getWeeksInYear = (year: number): number => {
  // The last day of a year can belong to the first week of the next year.
  // December 28th is always in the last week of its year.
  return dayjs(`${year}-12-28`).isoWeek();
};

export const getCurrentPeriod = (): SelectedPeriod => {
  const today = dayjs();
  return {
    year: today.year(),
    month: today.month() + 1,
    week: today.isoWeek(),
  };
};

export const getWeeklyRanges = (
  year: number
): { label: string; value: number }[] => {
  const totalWeeks = dayjs(`${year}-12-31`).isoWeeksInYear();
  const weeks = [];
  for (let i = 1; i <= totalWeeks; i++) {
    const startOfWeek = dayjs().year(year).isoWeek(i).startOf("isoWeek");
    const endOfWeek = dayjs().year(year).isoWeek(i).endOf("isoWeek");
    weeks.push({
      label: `${i}주차 (${startOfWeek.format("M/D")} ~ ${endOfWeek.format(
        "M/D"
      )})`,
      value: i,
    });
  }
  return weeks;
};

export const formatTime = (time: string): string => {
  if (!time || !time.includes(":")) {
    return "";
  }
  const [hour, minute] = time.split(":").map(Number);
  const isAM = hour < 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${isAM ? "오전" : "오후"} ${formattedHour}:${minute
    .toString()
    .padStart(2, "0")}`;
};
