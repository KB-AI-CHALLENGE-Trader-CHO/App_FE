import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AnalysisItem } from "../../types/analysis";
import DailyContextModal from "../../modals/DailyContextModal";
import IntradayTimingModal from "../../modals/IntradayTimingModal";

interface Props {
  item: AnalysisItem;
}

const korTradeType = (t: string) => (t === "BUY" ? "매수" : t === "SELL" ? "매도" : t);

const AiAnalysisItemCard: React.FC<Props> = ({ item }) => {
  const tradeTypeKor = korTradeType(item.tradeType);
  const isBuy = tradeTypeKor === "매수";

  const [dailyOpen, setDailyOpen] = useState(false);
  const [intraOpen, setIntraOpen] = useState(false);

  const hasDaily = !!item.analysisDetails?.dailyContext;
  const hasIntra = !!item.analysisDetails?.intradayTiming;
  const canShowEvidence = hasDaily || hasIntra;

  const openEvidence = () => {
    if (!canShowEvidence) return;
    if (hasDaily) setDailyOpen(true);
    else if (hasIntra) setIntraOpen(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.date ? (
          <Text style={styles.dateTimeText}>
            🗓️ {item.date} {item.time}
          </Text>
        ) : (
          <View />
        )}
        <Text style={styles.stockText}>
          <Text style={styles.stockNameText}>{item.stockName}</Text>
          {item.symbol ? <Text style={styles.symbolText}> ({item.symbol})</Text> : null}
          <Text> </Text>
          <Text style={isBuy ? styles.tradeTypeBuy : styles.tradeTypeSell}>
            {tradeTypeKor}
          </Text>
        </Text>
      </View>

      <View style={styles.content}>
        {item.memo ? (
          <Text style={styles.memoText}>
            <Text style={styles.label}>메모: </Text>
            "{item.memo}"
          </Text>
        ) : null}

        {item.suggestion ? (
          <View style={styles.suggestionSection}>
            <Text style={styles.label}>📌 제안</Text>
            <Text style={styles.suggestionText}>{item.suggestion}</Text>
          </View>
        ) : null}

        <View style={styles.linkRow}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={openEvidence}
            disabled={!canShowEvidence}
          >
            <Text
              style={[
                styles.linkText,
                !canShowEvidence && styles.linkTextDisabled,
              ]}
            >
              제안 근거 보기
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DailyContextModal
        visible={dailyOpen}
        onClose={() => setDailyOpen(false)}
        context={item.analysisDetails?.dailyContext}
        onNext={() => {
          setDailyOpen(false);
          setIntraOpen(true);
        }}
      />

      <IntradayTimingModal
        visible={intraOpen}
        onClose={() => setIntraOpen(false)}
        timing={item.analysisDetails?.intradayTiming}
        onPrev={() => {
          setIntraOpen(false);
          setDailyOpen(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  dateTimeText: { fontSize: 14, color: "#555" },
  stockText: { fontSize: 16, fontWeight: "bold" },
  stockNameText: { color: "#111111" }, // 항상 검정
  symbolText: { color: "#6B7280" },
  tradeTypeBuy: { color: "#D94A4A" },
  tradeTypeSell: { color: "#3067D9" },
  content: { gap: 12 },
  label: { fontWeight: "bold", color: "#333", marginBottom: 6 },
  memoText: { fontSize: 14, fontStyle: "italic", color: "#444" },
  suggestionSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
  },
  suggestionText: { fontSize: 14, color: "#1F2937", lineHeight: 20 },

  linkRow: {
    marginTop: 6,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#696969",
    textDecorationLine: "underline",
  },
  linkTextDisabled: {
    color: "#9CA3AF",
    textDecorationLine: "none",
  },
});

export default AiAnalysisItemCard;
