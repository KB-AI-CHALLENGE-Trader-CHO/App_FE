// src/screens/AiReportScreen.tsx

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../utils/dayjsConfig";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import ReportTabs from "../components/AiReport/ReportTabs";
import PeriodNavigator from "../components/AiReport/PeriodNavigator";
import AiReportCard, { ReportData } from "../components/AiReport/AiReportCard";
import {
  ReportMode,
  PeriodOption,
  WeeklyReportList,
  MonthlyReportList,
  parseYearlyList,
  toPeriodOptions,
} from "../types/report";

type Mode = ReportMode;

/** analyses(서버) ↔ analysis(카드 컴포넌트) 호환용 */
type ReportDto = Omit<ReportData, "analysis"> & {
  analysis?: ReportData["analysis"];
  analyses?: ReportData["analysis"];
};
const asReportData = (raw: ReportDto): ReportData => ({
  ...raw,
  analysis: raw.analysis ?? raw.analyses ?? [],
});

const AiReportScreen = () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("weekly");

  const [weeklyList, setWeeklyList] = useState<WeeklyReportList>({});
  const [monthlyList, setMonthlyList] = useState<MonthlyReportList>({});

  const [weeklyOptions, setWeeklyOptions] = useState<PeriodOption[]>([]);
  const [monthlyOptions, setMonthlyOptions] = useState<PeriodOption[]>([]);

  const [currentWeeklyId, setCurrentWeeklyId] = useState<number | null>(null);
  const [currentMonthlyId, setCurrentMonthlyId] = useState<number | null>(null);

  const [monthlyLoaded, setMonthlyLoaded] = useState(false);

  const [weeklyReport, setWeeklyReport] = useState<ReportData | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<ReportData | null>(null);

  const [weeklyNoData, setWeeklyNoData] = useState(false);
  const [monthlyNoData, setMonthlyNoData] = useState(false);

  const currentId = mode === "weekly" ? currentWeeklyId : currentMonthlyId;
  const currentReport = mode === "weekly" ? weeklyReport : monthlyReport;

  const fetchWeeklyBootstrap = async () => {
    const defaultRes = await api.get("/reports/weekly");
    if (defaultRes.data?.success && defaultRes.data.data) {
      setWeeklyReport(asReportData(defaultRes.data.data as ReportDto));
      setWeeklyNoData(false);
      const defId = Number(defaultRes.data.data.reportId);
      setCurrentWeeklyId(defId);
    } else {
      setWeeklyNoData(true);
      setWeeklyReport(null);
    }

    const listRes = await api.get("/reports/weekly/list");
    if (listRes.data?.success && listRes.data.data) {
      const yl = parseYearlyList(listRes.data.data);
      setWeeklyList(yl);
      setWeeklyOptions(toPeriodOptions(yl, "weekly", "asc"));
    }
  };

  const fetchMonthlyBootstrap = async () => {
    const defaultRes = await api.get("/reports/monthly");
    if (defaultRes.data?.success && defaultRes.data.data) {
      setMonthlyReport(asReportData(defaultRes.data.data as ReportDto));
      setMonthlyNoData(false);
      const defId = Number(defaultRes.data.data.reportId);
      setCurrentMonthlyId((prev) => prev ?? defId);
    } else {
      setMonthlyNoData(true);
      setMonthlyReport(null);
    }

    const listRes = await api.get("/reports/monthly/list");
    if (listRes.data?.success && listRes.data.data) {
      const yl = parseYearlyList(listRes.data.data);
      setMonthlyList(yl);
      setMonthlyOptions(toPeriodOptions(yl, "monthly", "asc"));
    }

    setMonthlyLoaded(true);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchWeeklyBootstrap();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (mode === "monthly" && !monthlyLoaded) {
      (async () => {
        setLoading(true);
        try {
          await fetchMonthlyBootstrap();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [mode, monthlyLoaded]);

  useEffect(() => {
    if (currentId == null) return;

    (async () => {
      setLoading(true);
      try {
        if (mode === "weekly") {
          const res = await api.get(`/reports/weekly/${currentId}`);
          if (res.data?.success && res.data.data) {
            setWeeklyReport(asReportData(res.data.data as ReportDto));
            setWeeklyNoData(false);
          } else {
            setWeeklyNoData(true);
            setWeeklyReport(null);
          }
        } else {
          const res = await api.get(`/reports/monthly/${currentId}`);
          if (res.data?.success && res.data.data) {
            setMonthlyReport(asReportData(res.data.data as ReportDto));
            setMonthlyNoData(false);
          } else {
            setMonthlyNoData(true);
            setMonthlyReport(null);
          }
        }
      } catch {
        if (mode === "weekly") {
          setWeeklyNoData(true);
          setWeeklyReport(null);
        } else {
          setMonthlyNoData(true);
          setMonthlyReport(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, currentId]);

  const handleChangeId = (id: number) => {
    if (mode === "weekly") setCurrentWeeklyId(id);
    else setCurrentMonthlyId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 분석 리포트</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ReportTabs mode={mode} onChangeMode={setMode} />

        <PeriodNavigator
          mode={mode}
          options={mode === "weekly" ? weeklyOptions : monthlyOptions}
          currentId={currentId ?? 0}
          onChange={handleChangeId}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>리포트를 불러오는 중...</Text>
          </View>
        ) : (mode === "weekly" && weeklyNoData) ||
          (mode === "monthly" && monthlyNoData) ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>해당 기간의 리포트가 없습니다.</Text>
          </View>
        ) : currentReport ? (
          <AiReportCard
            report={currentReport}
            title={mode === "weekly" ? "주간 AI 리포트" : "월간 AI 리포트"}
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>리포트를 찾을 수 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#FFCC00",
    paddingVertical: 16,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#645B4C" },
  contentContainer: { padding: 20 },
  noDataContainer: { alignItems: "center", padding: 20 },
  noDataText: { fontSize: 14, color: "#888", textAlign: "center" },
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
});

export default AiReportScreen;
