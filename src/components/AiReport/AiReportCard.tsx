import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AiAnalysisItemCard, { AnalysisItem } from "./AiAnalysisItemCard";

export interface ReportData {
  id: string;
  period: string;
  summary: string;
  analysis: AnalysisItem[];
}

interface Props {
  report: ReportData;
  title: string;
}

const AiReportCard: React.FC<Props> = ({ report, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📌 요약</Text>
        <Text style={styles.summaryText}>{report.summary}</Text>
      </View>

      {report.analysis.length > 0 && (
        <Text style={styles.listTitle}>상세 분석</Text>
      )}

      {report.analysis.map((item) => (
        <AiAnalysisItemCard key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
});

export default AiReportCard;
