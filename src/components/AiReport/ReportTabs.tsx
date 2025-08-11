import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export type ReportMode = "weekly" | "monthly";

interface ReportTabsProps {
  mode: ReportMode;
  onChangeMode: (mode: ReportMode) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ mode, onChangeMode }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, mode === "weekly" && styles.activeTab]}
        onPress={() => onChangeMode("weekly")}
      >
        <Text
          style={[styles.tabText, mode === "weekly" && styles.activeTabText]}
        >
          주간
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, mode === "monthly" && styles.activeTab]}
        onPress={() => onChangeMode("monthly")}
      >
        <Text
          style={[styles.tabText, mode === "monthly" && styles.activeTabText]}
        >
          월간
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
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
    color: "#FFCC00",
  },
});

export default ReportTabs;
