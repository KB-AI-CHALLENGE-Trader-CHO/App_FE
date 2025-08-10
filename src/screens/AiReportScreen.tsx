import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

// Mock Data
import weeklyReportData from "../data/mockWeeklyReport.json";
import monthlyReportData from "../data/mockMonthlyReport.json";
import dailyReportsData from "../data/mockDailyReports.json";

// Components
import AiReportCard, { ReportData } from "../components/AiReport/AiReportCard";
import PremiumBanner from "../components/AiReport/PremiumBanner";
import { AnalysisItem } from "../components/AiReport/AiAnalysisItemCard";

type ReportType = "daily" | "weekly" | "monthly";

// A type guard to check if an item is a full report
const isReportData = (item: any): item is ReportData => {
  return item && typeof item.summary === "string";
};

const AiReportScreen = () => {
  // Hardcoded premium status
  const isPremium = false;

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<ReportType>("weekly");

  // State for different reports
  const [weeklyReport, setWeeklyReport] = useState<ReportData | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<ReportData | null>(null);
  const [dailyReports, setDailyReports] = useState<ReportData[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Type assertion to ensure mock data matches the expected type
      setWeeklyReport({
        ...(weeklyReportData as Omit<ReportData, "id">),
        id: "weekly-report",
      });
      setMonthlyReport({
        ...(monthlyReportData as Omit<ReportData, "id">),
        id: "monthly-report",
      });
      const dailyData = dailyReportsData.map((r) => ({
        ...r,
        analysis: r.analysis as AnalysisItem[],
      }));
      setDailyReports(dailyData as ReportData[]);

      setLoading(false);
    }, 1000);
  }, []);

  const renderPremiumContent = () => {
    let content;
    switch (selectedTab) {
      case "weekly":
        content = weeklyReport && (
          <AiReportCard report={weeklyReport} title="주간 AI 리포트" />
        );
        break;
      case "monthly":
        content = monthlyReport && (
          <AiReportCard report={monthlyReport} title="월간 AI 리포트" />
        );
        break;
      case "daily":
        content = (
          <FlatList
            data={dailyReports}
            renderItem={({ item }) => (
              <AiReportCard report={item} title={item.period} />
            )}
            keyExtractor={(item) => item.id}
            nestedScrollEnabled
          />
        );
        break;
      default:
        content = null;
    }

    return (
      <View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "daily" && styles.activeTab]}
            onPress={() => setSelectedTab("daily")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "daily" && styles.activeTabText,
              ]}
            >
              일일
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "weekly" && styles.activeTab]}
            onPress={() => setSelectedTab("weekly")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "weekly" && styles.activeTabText,
              ]}
            >
              주간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "monthly" && styles.activeTab]}
            onPress={() => setSelectedTab("monthly")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "monthly" && styles.activeTabText,
              ]}
            >
              월간
            </Text>
          </TouchableOpacity>
        </View>
        {content}
      </View>
    );
  };

  const renderFreeContent = () => {
    return (
      <>
        {weeklyReport && (
          <AiReportCard report={weeklyReport} title="이번 주 AI 리포트" />
        )}
        <PremiumBanner />
      </>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>AI 리포트를 생성하는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.screenTitle}>📊 AI 분석 리포트</Text>
        {isPremium ? renderPremiumContent() : renderFreeContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    padding: 20,
  },
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  activeTabText: {
    color: "#0D6EFD",
  },
});

export default AiReportScreen;
