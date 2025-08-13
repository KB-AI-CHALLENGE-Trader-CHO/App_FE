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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.date ? (
          <Text style={styles.dateTimeText}>
            {item.date} {item.time}
          </Text>
        ) : (
          <View />
        )}
        <Text style={[styles.stockText, isBuy ? styles.buyText : styles.sellText]}>
          {item.stockName}
          {item.symbol ? ` (${item.symbol})` : ""} {tradeTypeKor}
        </Text>
      </View>

      <View style={styles.content}>
        {item.memo ? (
          <Text style={styles.memoText}>
            <Text style={styles.label}>메모: </Text>
            "{item.memo}"
          </Text>
        ) : null}

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.btn, !hasDaily && styles.btnDisabled]}
            onPress={() => setDailyOpen(true)}
            disabled={!hasDaily}
          >
            <Text style={[styles.btnText, !hasDaily && styles.btnTextDisabled]}>일봉 컨텍스트</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, !hasIntra && styles.btnDisabled]}
            onPress={() => setIntraOpen(true)}
            disabled={!hasIntra}
          >
            <Text style={[styles.btnText, !hasIntra && styles.btnTextDisabled]}>분봉 타이밍</Text>
          </TouchableOpacity>
        </View>

        {item.suggestion ? (
          <View style={styles.suggestionSection}>
            <Text style={styles.label}>제안</Text>
            <Text style={styles.suggestionText}>{item.suggestion}</Text>
          </View>
        ) : null}
      </View>

      <DailyContextModal
        visible={dailyOpen}
        onClose={() => setDailyOpen(false)}
        context={item.analysisDetails?.dailyContext}
      />
      <IntradayTimingModal
        visible={intraOpen}
        onClose={() => setIntraOpen(false)}
        timing={item.analysisDetails?.intradayTiming}
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
  buyText: { color: "#D94A4A" },
  sellText: { color: "#3067D9" },
  content: { gap: 12 },
  label: { fontWeight: "bold", color: "#333", marginBottom: 6 },
  memoText: { fontSize: 14, fontStyle: "italic", color: "#444" },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  btnDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4338CA",
  },
  btnTextDisabled: {
    color: "#9CA3AF",
  },

  suggestionSection: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
  },
  suggestionText: { fontSize: 14, color: "#1F2937", lineHeight: 20 },
});

export default AiAnalysisItemCard;
