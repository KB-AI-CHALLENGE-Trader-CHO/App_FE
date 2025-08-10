import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SymbolSummary } from "../hooks/useSymbolSummary";
import { chartConfig, chartStyles } from "../constants/chartConfig";

interface SymbolBarChartProps {
  data: SymbolSummary[];
}

const screenWidth = Dimensions.get("window").width;

const SymbolBarChart: React.FC<SymbolBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Top 3 수익 종목</Text>
        <Text style={styles.noDataText}>표시할 데이터가 없습니다.</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.profit),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 3 수익 종목</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix="원"
        chartConfig={{
          ...chartConfig,
          // 막대 색상을 수익에 따라 다르게 설정 (라이브러리 기능 제한으로 단일 색상만 가능)
          // 대신 막대 아래/위 라벨로 색상 구분 제안 가능
        }}
        verticalLabelRotation={0}
        style={chartStyles.chart}
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
  },
  noDataText: {
    marginTop: 20,
    color: "#888",
  },
});

export default SymbolBarChart;
