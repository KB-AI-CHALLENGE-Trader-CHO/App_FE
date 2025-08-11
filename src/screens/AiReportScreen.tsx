import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import dayjs from "dayjs";
import "../utils/dayjsConfig";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import ReportTabs, { ReportMode } from "../components/AiReport/ReportTabs";
import PeriodNavigator, {
  PeriodOption,
} from "../components/AiReport/PeriodNavigator";
import AiReportCard, { ReportData } from "../components/AiReport/AiReportCard";
import { AnalysisItem } from "../components/AiReport/AiAnalysisItemCard";
// import { getWeeklyRanges } from "../utils/getWeeklyRanges";

type Mode = ReportMode; // "weekly" | "monthly"

const mapAnalysisItem = (item: any, idx: number): AnalysisItem => {
  let date = "";
  let time = "";
  if (item.dateTime) {
    const [d, t] = String(item.dateTime).split(" ");
    date = d || "";
    time = t || "";
  }
  return {
    id: item.id || `analysis-${idx}`,
    date,
    time,
    stockName: item.stockName || item.title || "",
    tradeType:
      item.transactionType === "매수"
        ? "매수"
        : item.transactionType === "매도"
        ? "매도"
        : String(item.transactionType || ""),
    memo: item.memo || "",
    analysisDetails: Array.isArray(item.analysisDetails)
      ? item.analysisDetails
      : String(item.analysisDetails || ""),
    suggestion: String(item.suggestion || ""),
    symbol: item.symbol,
  };
};

const AiReportScreen = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("weekly");

  // Reports for selected period
  const [weeklyReport, setWeeklyReport] = useState<ReportData | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<ReportData | null>(null);
  // Flags when API success but no data
  const [weeklyNoData, setWeeklyNoData] = useState<boolean>(false);
  const [monthlyNoData, setMonthlyNoData] = useState<boolean>(false);
  // Options fetched from list API
  const [weeklyOptionsState, setWeeklyOptionsState] = useState<PeriodOption[]>(
    []
  );
  const [monthlyOptionsState, setMonthlyOptionsState] = useState<
    PeriodOption[]
  >([]);

  // Options for dropdown and selected period (initialize from today's date)
  const computeCurrentPeriods = () => {
    const now = dayjs();
    const yearW = (now as any).isoWeekYear?.() ?? now.year();
    const week = (now as any).isoWeek?.() ?? now.week?.() ?? 1;
    const yearM = now.year();
    const month = now.month() + 1;
    return { yearW, week, yearM, month };
  };
  const initPeriods = computeCurrentPeriods();
  const [selectedYear, setSelectedYear] = useState<number>(initPeriods.yearW);
  const [selectedWeek, setSelectedWeek] = useState<number>(initPeriods.week);
  const [selectedMonth, setSelectedMonth] = useState<number>(initPeriods.month);
  const weeklyOptions: PeriodOption[] = weeklyOptionsState;
  const monthlyOptions: PeriodOption[] = monthlyOptionsState;

  const currentKey =
    mode === "weekly"
      ? `w-${selectedYear}-${selectedWeek}`
      : `m-${selectedYear}-${selectedMonth}`;

  const getWeeklyMonthLabel = (isoYear: number, isoWeek: number): string => {
    const firstIsoWeekStart = dayjs()
      .year(isoYear)
      .month(0)
      .date(4)
      .startOf("isoWeek");
    const weekStart = firstIsoWeekStart.add(isoWeek - 1, "week");
    const month = weekStart.month() + 1;
    const monthStartWeekStart = weekStart.startOf("month").startOf("isoWeek");
    const weekInMonth =
      weekStart.startOf("isoWeek").diff(monthStartWeekStart, "week") + 1;
    return `${isoYear}년 ${month}월 ${weekInMonth}주차`;
  };

  const fallbackLabel =
    mode === "weekly"
      ? getWeeklyMonthLabel(selectedYear, selectedWeek)
      : `${selectedYear}년 ${selectedMonth}월`;
  const baseOptions = mode === "weekly" ? weeklyOptions : monthlyOptions;
  const currentOptions =
    baseOptions && baseOptions.length > 0
      ? baseOptions
      : [{ key: currentKey, label: fallbackLabel }];
  const currentReport = mode === "weekly" ? weeklyReport : monthlyReport;

  // API-based fetching added below

  const mapReportFromApi = (raw: any, id: string): ReportData => ({
    id,
    period: raw?.period ?? "",
    summary: raw?.summary ?? "",
    analysis: Array.isArray(raw?.analysis)
      ? raw.analysis.map((item: any, idx: number) => mapAnalysisItem(item, idx))
      : [],
  });

  const fetchWeeklyList = async (): Promise<PeriodOption[]> => {
    try {
      const res = await api.get(`/api/ai-reports/weekly-list`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const opts: PeriodOption[] = res.data.data.map((x: any) => ({
          key: `w-${x.year}-${x.week}`,
          label: x.label,
        }));
        setWeeklyOptionsState(opts);
        return opts;
      }
    } catch {}
    // Fallback to mock
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mock = require("../data/mockWeeklyReportList.json");
      if (mock?.success && Array.isArray(mock.data)) {
        const opts: PeriodOption[] = mock.data.map((x: any) => ({
          key: `w-${x.year}-${x.week}`,
          label: x.label,
        }));
        setWeeklyOptionsState(opts);
        return opts;
      }
    } catch {}
    return [];
  };

  const fetchMonthlyList = async (): Promise<PeriodOption[]> => {
    try {
      const res = await api.get(`/api/ai-reports/monthly-list`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const opts: PeriodOption[] = res.data.data.map((x: any) => ({
          key: `m-${x.year}-${x.month}`,
          label: x.label,
        }));
        setMonthlyOptionsState(opts);
        return opts;
      }
    } catch {}
    // Fallback to mock
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mock = require("../data/mockMonthlyReportList.json");
      if (mock?.success && Array.isArray(mock.data)) {
        const opts: PeriodOption[] = mock.data.map((x: any) => ({
          key: `m-${x.year}-${x.month}`,
          label: x.label,
        }));
        setMonthlyOptionsState(opts);
        return opts;
      }
    } catch {}
    return [];
  };

  const fetchWeeklyReport = async (
    year: number,
    week: number
  ): Promise<void> => {
    try {
      const response = await api.get(`/api/ai-reports/weekly`, {
        params: { year, week },
      });
      if (response.data?.success) {
        const raw = response.data.data;
        if (!raw) {
          setWeeklyNoData(true);
          setWeeklyReport(null);
        } else {
          setWeeklyNoData(false);
          setWeeklyReport(mapReportFromApi(raw, `weekly-${year}-${week}`));
        }
      } else {
        setWeeklyNoData(true);
        setWeeklyReport(null);
      }
    } catch (e) {
      console.error("Error fetching weekly report:", e);
      setWeeklyNoData(true);
      setWeeklyReport(null);
    }
  };

  const fetchMonthlyReport = async (
    year: number,
    month: number
  ): Promise<void> => {
    try {
      const response = await api.get(`/api/ai-reports/monthly`, {
        params: { year, month },
      });
      if (response.data?.success) {
        const raw = response.data.data;
        if (!raw) {
          setMonthlyNoData(true);
          setMonthlyReport(null);
        } else {
          setMonthlyNoData(false);
          setMonthlyReport(mapReportFromApi(raw, `monthly-${year}-${month}`));
        }
      } else {
        setMonthlyNoData(true);
        setMonthlyReport(null);
      }
    } catch (e) {
      console.error("Error fetching monthly report:", e);
      setMonthlyNoData(true);
      setMonthlyReport(null);
    }
  };

  const computeEffectivePeriods = () => {
    // Always use today's week/month for display and fetching.
    // If API has not generated yet, UI will show the "생성 예정" message via noData flag.
    const now = dayjs();
    const yearW = (now as any).isoWeekYear?.() ?? now.year();
    const week = (now as any).isoWeek?.() ?? now.week?.() ?? 1;
    const yearM = now.year();
    const month = now.month() + 1;
    return { yearW, week, yearM, month };
  };

  // Initial load: fetch lists then current period reports
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchWeeklyList();
        await fetchMonthlyList();
        const { yearW, week, yearM, month } = computeEffectivePeriods();
        setSelectedYear(yearW);
        setSelectedWeek(week);
        setSelectedMonth(month);
        await fetchWeeklyReport(yearW, week);
        await fetchMonthlyReport(yearM, month);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when mode/period changes
  useEffect(() => {
    const refetch = async () => {
      try {
        setLoading(true);
        if (mode === "weekly")
          await fetchWeeklyReport(selectedYear, selectedWeek);
        else await fetchMonthlyReport(selectedYear, selectedMonth);
      } finally {
        setLoading(false);
      }
    };
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedYear, selectedWeek, selectedMonth]);

  const onChangeMode = (next: Mode) => setMode(next);
  const onChangePeriod = (key: string) => {
    const mw = key.match(/^w-(\d+)-(\d+)$/);
    const mm = key.match(/^m-(\d+)-(\d+)$/);
    if (mw) {
      setSelectedYear(Number(mw[1]));
      setSelectedWeek(Number(mw[2]));
      return;
    }
    if (mm) {
      setSelectedYear(Number(mm[1]));
      setSelectedMonth(Number(mm[2]));
    }
  };

  // Enable left/right navigation in monthly mode by reusing list state
  useEffect(() => {
    const ensureLists = async () => {
      if (weeklyOptionsState.length === 0) await fetchWeeklyList();
      if (monthlyOptionsState.length === 0) await fetchMonthlyList();
    };
    ensureLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" />
  //       <Text style={styles.loadingText}>AI 리포트를 생성하는 중...</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 분석 리포트</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ReportTabs mode={mode} onChangeMode={onChangeMode} />

        <PeriodNavigator
          mode={mode}
          options={currentOptions}
          currentKey={currentKey}
          onChange={onChangePeriod}
          onOpen={async () => {
            try {
              if (mode === "weekly") {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const res = require("../data/mockWeeklyReportList.json");
                if (res?.success && Array.isArray(res.data)) {
                  const opts: PeriodOption[] = res.data.map((x: any) => ({
                    key: `w-${x.year}-${x.week}`,
                    label: x.label,
                  }));
                  setWeeklyOptionsState(opts);
                  if (!opts.find((o) => o.key === currentKey) && opts[0]) {
                    onChangePeriod(opts[0].key);
                  }
                }
              } else {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const res = require("../data/mockMonthlyReportList.json");
                if (res?.success && Array.isArray(res.data)) {
                  const opts: PeriodOption[] = res.data.map((x: any) => ({
                    key: `m-${x.year}-${x.month}`,
                    label: x.label,
                  }));
                  setMonthlyOptionsState(opts);
                  if (!opts.find((o) => o.key === currentKey) && opts[0]) {
                    onChangePeriod(opts[0].key);
                  }
                }
              }
            } catch (e) {
              // ignore errors in mock load
            }
          }}
        />

        {(mode === "weekly" && weeklyNoData) ||
        (mode === "monthly" && monthlyNoData) ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              이번주 리포트는 일요일 00:00 시에 생성될 예정입니다.{"\n"}
              이전 날짜를 눌러 생성된 리포트를 확인해보세요.
            </Text>
          </View>
        ) : currentReport ? (
          <AiReportCard
            report={{
              ...currentReport,
              period:
                mode === "weekly"
                  ? getWeeklyMonthLabel(selectedYear, selectedWeek)
                  : currentReport.period,
            }}
            title={mode === "weekly" ? "주간 AI 리포트" : "월간 AI 리포트"}
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>해당 기간의 리포트가 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFCC00",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#645B4C",
  },
  contentContainer: {
    padding: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBox: {
    backgroundColor: "#FFF",
    borderColor: "#EEE",
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { color: "#666" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});

export default AiReportScreen;
