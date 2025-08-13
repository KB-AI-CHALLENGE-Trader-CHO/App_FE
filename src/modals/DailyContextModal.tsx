import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DailyContext } from "../types/analysis";

interface Props {
  visible: boolean;
  onClose: () => void;
  context?: DailyContext;
}

const label = {
  trend: "추세",
  maStack: "이평 정렬",
  rsi: "RSI",
  stochastic: "스토캐스틱",
  bollingerEvent: "볼린저 이벤트",
  obvSignal: "OBV 신호",
  atrRegime: "ATR 레짐",
  keltnerEvent: "켈트너 위치",
} as const;

const fmt = (n: number | undefined, digits = 2) =>
  typeof n === "number" ? n.toFixed(digits) : "-";

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <View style={styles.row}>
    <Text style={styles.rowKey}>{k}</Text>
    <Text style={styles.rowVal}>{v}</Text>
  </View>
);

const DailyContextModal: React.FC<Props> = ({ visible, onClose, context }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>일봉 컨텍스트</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {!context ? (
              <Text style={styles.empty}>데이터가 없습니다.</Text>
            ) : (
              <>
                <Row k={label.trend} v={context.trend} />
                <Row k={label.maStack} v={context.maStack} />
                <Row
                  k={label.rsi}
                  v={`${fmt(context.rsi?.value)} (${context.rsi?.status ?? "-"})`}
                />
                <Row
                  k={label.stochastic}
                  v={`${fmt(context.stochastic?.value)} (${context.stochastic?.status ?? "-"})`}
                />
                {context.bollingerEvent && (
                  <Row k={label.bollingerEvent} v={context.bollingerEvent} />
                )}
                {context.obvSignal && <Row k={label.obvSignal} v={context.obvSignal} />}
                {context.atrRegime && <Row k={label.atrRegime} v={context.atrRegime} />}
                {context.keltnerEvent && (
                  <Row k={label.keltnerEvent} v={context.keltnerEvent} />
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    maxHeight: "80%",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "600" },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  closeText: { fontSize: 12, color: "#333" },
  content: { padding: 16 },
  row: { flexDirection: "row", marginBottom: 8 },
  rowKey: { width: 110, color: "#555" },
  rowVal: { flex: 1, color: "#111" },
  empty: { color: "#666" },
});

export default DailyContextModal;
