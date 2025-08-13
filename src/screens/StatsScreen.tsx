import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";

import { Transaction } from "../models/transactionDemo";
import { getTrades } from "../storage/tradeStorage";
import { useFilteredTransactions } from "../hooks/useFilteredTrasactions";
import StatsCard from "../components/Stats/StatsCard";
import { useStatsSummary } from "../hooks/useStatsSummary";
import PeriodSelectorModal from "../components/Stats/PeriodSelectorModal";
import { getWeeklyRanges } from "../utils/getWeeklyRanges";
import TrendLineChart from "../components/TrendLineChart";
import { useDailyTrends } from "../hooks/useDailyTrends";
import { useMonthlyTrends } from "../hooks/useMonthlyTrends";

// --- Types ---
type RangeType = "week" | "month" | "year";
// PeriodSelectorModal의 prop에서 타입을 직접 추론하여 사용
type SelectedPeriod = React.ComponentProps<
  typeof PeriodSelectorModal
>["currentPeriod"];
type TransactionsData = Record<string, Transaction[]>;

// --- Re-added PeriodSelector Component ---
const PeriodSelector: React.FC<{
  selectedRange: RangeType;
  onSelect: (range: RangeType) => void;
}> = ({ selectedRange, onSelect }) => {
  const ranges: RangeType[] = ["week", "month", "year"];
  const rangeLabels: Record<RangeType, string> = {
    week: "주간",
    month: "월간",
    year: "연간",
  };

  return (
    <View style={styles.selectorContainer}>
      {ranges.map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.selectorButton,
            selectedRange === range && styles.selectorButtonActive,
          ]}
          onPress={() => onSelect(range)}
        >
          <Text
            style={[
              styles.selectorText,
              selectedRange === range && styles.selectorTextActive,
            ]}
          >
            {rangeLabels[range]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const StatsScreen = () => {
  const [allTransactions, setAllTransactions] = useState<TransactionsData>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [rangeType, setRangeType] = useState<RangeType>("month");
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>({
    year: dayjs().year(),
    month: dayjs().month() + 1,
    week: dayjs().isoWeek(),
  } as SelectedPeriod);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
  const data = await getTrades();
  setAllTransactions(data);
      };
      loadData();
    }, [])
  );

  const filteredTransactions = useFilteredTransactions(
    allTransactions,
    rangeType,
    selectedPeriod
  );

  const { realizedProfit, returnRate, totalBuy, totalSell } =
    useStatsSummary(filteredTransactions);

  const dailyTrends = useDailyTrends(filteredTransactions);
  const monthlyTrends = useMonthlyTrends(filteredTransactions);

  const handleRangeChange = (newRange: RangeType) => {
    setRangeType(newRange);
    // Reset period to current when range type changes
    setSelectedPeriod({
      year: dayjs().year(),
      month: dayjs().month() + 1,
      week: dayjs().isoWeek(),
    });
  };

  const formatPeriod = (period: SelectedPeriod, type: RangeType): string => {
    const { year, month, week } = period;
    const weeks = getWeeklyRanges(year);
    const weekLabel =
      weeks.find((w) => w.value === week)?.label || `${week}주차`;

    switch (type) {
      case "week":
        return `${year}년 ${weekLabel}`;
      case "month":
        return `${year}년 ${month}월`;
      case "year":
        return `${year}년`;
      default:
        return "";
    }
  };

  const handleConfirmPeriod = (period: SelectedPeriod, type: RangeType) => {
    setSelectedPeriod(period);
    setRangeType(type);
    setModalVisible(false);
  };

  const isProfit = realizedProfit >= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>요약 통계</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* === Top Section Start === */}
        <PeriodSelector
          selectedRange={rangeType}
          onSelect={handleRangeChange}
        />

        <View style={styles.periodSelectionContainer}>
          <TouchableOpacity
            style={styles.periodSelectorButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.periodText}>
              {formatPeriod(selectedPeriod, rangeType)}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
        {/* === Top Section End === */}

        <View style={styles.statsCardContainer}>
          <StatsCard
            label="실현 손익"
            value={realizedProfit.toLocaleString()}
            unit="원"
            iconName={
              isProfit ? "trending-up-outline" : "trending-down-outline"
            }
            iconColor={isProfit ? "#10B981" : "#EF4444"}
          />
          <StatsCard
            label="수익률"
            value={returnRate.toFixed(2)}
            unit="%"
            iconName="analytics-outline"
            iconColor={isProfit ? "#10B981" : "#EF4444"}
          />
          <StatsCard
            label="총 매수"
            value={totalBuy.toLocaleString()}
            unit="원"
            iconName="add-circle-outline"
          />
          <StatsCard
            label="총 매도"
            value={totalSell.toLocaleString()}
            unit="원"
            iconName="remove-circle-outline"
          />
        </View>

        <View style={styles.divider} />

        <TrendLineChart
          data={rangeType === "year" ? monthlyTrends : dailyTrends}
        />
      </ScrollView>
      <PeriodSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmPeriod}
        rangeType={rangeType}
        currentPeriod={selectedPeriod}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  periodSelectionContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  periodSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginRight: 4,
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  selectorButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 12,
    backgroundColor: "#F0F0F0",
  },
  selectorButtonActive: {
    backgroundColor: "#645B4C",
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#645B4C",
  },
  selectorTextActive: {
    color: "#FFFFFF",
  },
  statsCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 24,
  },
});

export default StatsScreen;
