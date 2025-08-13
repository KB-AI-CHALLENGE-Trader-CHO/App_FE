import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { IntradayTiming } from "../types/analysis";

interface Props {
  visible: boolean;
  onClose: () => void;
  timing?: IntradayTiming;
}

const label = {
  trend: "추세",
  maStack: "이평 정렬",
  rsi: "RSI",
  stochastic: "스토캐스틱",
  bollingerEvent: "볼린저 이벤트",
  volumeZScore: "거래량 Z-Score",
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

const IntradayTimingModal: React.FC<Props> = ({ visible, onClose, timing }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>분봉 타이밍</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {!timing ? (
              <Text style={styles.empty}>데이터가 없습니다.</Text>
            ) : (
              <>
                <Row k={label.trend} v={timing.trend} />
                <Row k={label.maStack} v={timing.maStack} />
                <Row
                  k={label.rsi}
                  v={`${fmt(timing.rsi?.value)} (${timing.rsi?.status ?? "-"})`}
                />
                <Row
                  k={label.stochastic}
                  v={`${fmt(timing.stochastic?.value)} (${timing.stochastic?.status ?? "-"})`}
                />
                {typeof timing.volumeZScore === "number" && (
                  <Row k={label.volumeZScore} v={fmt(timing.volumeZScore, 3)} />
                )}
                {timing.bollingerEvent && (
                  <Row k={label.bollingerEvent} v={timing.bollingerEvent} />
                )}
                {timing.keltnerEvent && (
                  <Row k={label.keltnerEvent} v={timing.keltnerEvent} />
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

export default IntradayTimingModal;
