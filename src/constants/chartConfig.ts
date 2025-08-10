import { StyleSheet } from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";

export const chartConfig: AbstractChartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue for profit
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#007AFF",
  },
  propsForBackgroundLines: {
    stroke: "#e3e3e3",
  },
};

export const chartStyles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
