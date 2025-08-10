import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { DailyTrend } from "../hooks/useDailyTrends";
import { chartConfig, chartStyles } from "../constants/chartConfig";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";

interface TrendLineChartProps {
  data: DailyTrend[];
}

const screenWidth = Dimensions.get("window").width;

const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
  const hasData = data && data.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>거래 횟수</Text>
        <View style={styles.noChartDataView}>
          <Text style={styles.noDataText}>표시할 데이터가 없습니다.</Text>
        </View>
      </View>
    );
  }

  const labels = data.map((item) => item.date);

  const barChartData = {
    labels,
    datasets: [{ data: data.map((item) => item.count) }],
  };

  const barChartConfig: AbstractChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>거래 횟수</Text>
      <BarChart
        data={barChartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={barChartConfig}
        style={chartStyles.chart}
        yAxisLabel=""
        yAxisSuffix="건"
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  noDataText: {
    color: "#888",
  },
  noChartDataView: {
    height: 220,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
});

export default TrendLineChart;
