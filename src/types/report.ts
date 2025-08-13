// src/types/report.ts
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";

// ISO 주(월요일 시작) 관련 확장
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export type ReportMode = "weekly" | "monthly";

export interface ReportOrder {
  id: number;      // PK
  order: number;   // 주간: 연중 ISO 주차(1~53), 월간: 월(1~12)
}

export interface YearlyReportList {
  [year: string]: ReportOrder[];
}

export type WeeklyReportList = YearlyReportList;
export type MonthlyReportList = YearlyReportList;

export interface PeriodOption {
  id: number;
  key: string;
  label: string; // 예: "2025년 8월 3주차" / "2025년 8월"
}

/**
 * 해당 연-월의 '월 내 주차' 개수(최대 6)를 계산
 * 기준: ISO 주(월요일 시작). 그 달의 1일이 속한 ISO 주를 1주차로 간주.
 */
function weeksInMonth(year: number, month1to12: number): number {
  const firstOfMonth = dayjs().year(year).month(month1to12 - 1).date(1);
  const lastOfMonth = firstOfMonth.endOf("month");

  const firstWeekStart = firstOfMonth.startOf("isoWeek");
  const lastWeekStart = lastOfMonth.startOf("isoWeek");

  return lastWeekStart.diff(firstWeekStart, "week") + 1; // 4~6
}

/**
 * 연중 ISO 주차 -> (월, 월 내 주차)로 변환
 * - 주의 월요일(ISO) 기준으로 월을 결정
 * - 월 내 주차 = (해당 주 월요일 - 그 달의 첫 ISO 주 시작월요일) 주 차이 + 1
 * - 경계 주(전/다음달 걸침)는 월요일이 속한 달로 계산
 */
function getMonthAndWeekOfMonthFromIsoWeek(year: number, isoWeekNumber: number) {
  const weekStart = dayjs().year(year).isoWeek(isoWeekNumber).startOf("isoWeek");
  const month1to12 = weekStart.month() + 1; // 1~12

  const firstOfMonth = dayjs().year(year).month(month1to12 - 1).date(1);
  const firstWeekStart = firstOfMonth.startOf("isoWeek");

  let wom = weekStart.diff(firstWeekStart, "week") + 1;
  const maxWeeks = weeksInMonth(year, month1to12);
  if (wom < 1) wom = 1;
  if (wom > maxWeeks) wom = maxWeeks;

  return { month: month1to12, weekOfMonth: wom };
}

export const toPeriodOptions = (
  list: YearlyReportList,
  mode: ReportMode,
  sort: "asc" | "desc" = "asc"
): PeriodOption[] => {
  const entries = Object.entries(list);
  const options: PeriodOption[] = [];

  const yearSorted = entries.sort((a, b) => Number(a[0]) - Number(b[0]));
  const orderCmp = (a: number, b: number) => (sort === "asc" ? a - b : b - a);

  for (const [yearStr, arr] of yearSorted) {
    const year = Number(yearStr);
    const sortedArr = [...arr].sort((a, b) => orderCmp(a.order, b.order));

    for (const o of sortedArr) {
      if (mode === "weekly") {
        const { month, weekOfMonth } = getMonthAndWeekOfMonthFromIsoWeek(year, o.order);
        options.push({
          id: o.id,
          key: `w-${year}-${o.order}`,
          label: `${year}년 ${month}월 ${weekOfMonth}주차`,
        });
      } else {
        options.push({
          id: o.id,
          key: `m-${year}-${o.order}`,
          label: `${year}년 ${o.order}월`,
        });
      }
    }
  }
  return options;
};

export const parseYearlyList = (raw: any): YearlyReportList => {
  const result: YearlyReportList = {};
  Object.entries(raw || {}).forEach(([year, arr]: any) => {
    result[String(year)] = Array.isArray(arr)
      ? arr.map((x: any) => ({
          id: Number(x.id),
          order: Number(x.order),
        }))
      : [];
  });
  return result;
};
