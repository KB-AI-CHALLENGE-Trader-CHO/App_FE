import dayjs from "dayjs";

export interface WeeklyRange {
  label: string;
  value: number;
}

/**
 * 주어진 연도에 대한 모든 ISO 주차의 리스트를 날짜 범위 레이블과 함께 반환합니다.
 * ISO 8601 표준에 따라, 1월 4일은 항상 그 해의 첫 번째 주에 속합니다.
 * @param year - 주차를 계산할 연도
 * @returns 예: [{ label: "1주차 (1/1 ~ 1/7)", value: 1 }, ...]
 */
export const getWeeklyRanges = (year: number): WeeklyRange[] => {
  const ranges: WeeklyRange[] = [];

  // 1월 4일이 포함된 주가 항상 해당 연도의 첫 번째 ISO 주차입니다.
  let current = dayjs().year(year).month(0).date(4).startOf("isoWeek");
  let week = 1;

  // 해당 연도에 속하는 주차인 동안 루프를 계속합니다.
  while (current.isoWeekYear() === year) {
    const startDate = current.startOf("isoWeek");
    const endDate = current.endOf("isoWeek");

    ranges.push({
      label: `${week}주차 (${startDate.format("M/D")}~${endDate.format(
        "M/D"
      )})`,
      value: week,
    });

    current = current.add(1, "week");
    week++;
  }

  return ranges;
};
