import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface AnalysisItem {
  id: string;
  dateTime: string;
  stockName: string;
  transactionType: "매수" | "매도";
  memo: string;
  analysisDetails: string[];
  suggestion: string;
}

interface Props {
  item: AnalysisItem;
}

const AiAnalysisItemCard: React.FC<Props> = ({ item }) => {
  const isBuy = item.transactionType === "매수";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dateTimeText}>🗓️ {item.dateTime}</Text>
        <Text
          style={[styles.stockText, isBuy ? styles.buyText : styles.sellText]}
        >
          {item.stockName} {item.transactionType}
        </Text>
      </View>

      <View style={styles.content}>
        {item.memo ? (
          <Text style={styles.memoText}>
            <Text style={styles.label}>메모:</Text> "{item.memo}"
          </Text>
        ) : null}

        <View style={styles.analysisSection}>
          <Text style={styles.label}>💡 분석 결과:</Text>
          {item.analysisDetails.map((detail, index) => (
            <Text key={index} style={styles.detailText}>
              - {detail}
            </Text>
          ))}
        </View>

        <View style={styles.suggestionSection}>
          <Text style={styles.label}>📌 제안:</Text>
          <Text style={styles.suggestionText}>{item.suggestion}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 14,
    color: "#555",
  },
  stockText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buyText: { color: "#D94A4A" },
  sellText: { color: "#3067D9" },
  content: {
    gap: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  memoText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
  },
  analysisSection: {},
  detailText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginLeft: 4,
  },
  suggestionSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
});

export default AiAnalysisItemCard;
