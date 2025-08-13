import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { IntradayTiming } from "../types/analysis";

interface Props {
  visible: boolean;
  onClose: () => void;
  timing?: IntradayTiming;
  onPrev?: () => void; // 중장기(일봉) 평가로
}

const label = {
  trend: "장중 추세",
  maStack: "장중 이평선",
  rsi: "RSI",
  stochastic: "스토캐스틱",
  bollingerEvent: "장중 볼린저밴드",
  volumeZScore: "거래량 Z-Score",
  keltnerEvent: "켈트너 채널",
} as const;

const fmt = (n: number | undefined, digits = 2) =>
  typeof n === "number" ? n.toFixed(digits) : "-";

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <View style={styles.row}>
    <Text style={styles.rowKey}>{k}</Text>
    <Text style={styles.rowVal}>{v}</Text>
  </View>
);

const IntradayTimingModal: React.FC<Props> = ({ visible, onClose, timing, onPrev }) => {
  const handlePrev = () => {
    onClose();
    onPrev?.();
  };

  const withSig = (sig?: string, text?: string | number) =>
    [sig, text].filter(Boolean).join(" ");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* 바깥 터치 → 닫기 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* 안쪽 터치는 닫히지 않도록 */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>단기 평가 기준</Text>
                <TouchableOpacity onPress={handlePrev} style={styles.rightBtn}>
                  <Text style={styles.rightBtnText}>중장기 평가로</Text>
                </TouchableOpacity>
              </View>

              {/* Body */}
              <ScrollView contentContainerStyle={styles.content}>
                {!timing ? (
                  <Text style={styles.empty}>데이터가 없습니다.</Text>
                ) : (
                  <>
                    <Row k={label.trend} v={withSig(timing.trendSignal, timing.trend)} />
                    <Row k={label.maStack} v={withSig(timing.maStackSignal, timing.maStack)} />
                    <Row
                      k={label.rsi}
                      v={withSig(
                        timing.rsiSignal,
                        `${fmt(timing.rsi?.value)} (${timing.rsi?.status ?? "-"})`
                      )}
                    />
                    <Row
                      k={label.stochastic}
                      v={withSig(
                        timing.stochasticSignal,
                        `${fmt(timing.stochastic?.value)} (${timing.stochastic?.status ?? "-"})`
                      )}
                    />
                    {typeof timing.volumeZScore === "number" && (
                      <Row k={label.volumeZScore} v={fmt(timing.volumeZScore, 3)} />
                    )}
                    {timing.bollingerEvent && (
                      <Row
                        k={label.bollingerEvent}
                        v={withSig(timing.bollingerSignal, timing.bollingerEvent)}
                      />
                    )}
                    {timing.keltnerEvent && (
                      <Row
                        k={label.keltnerEvent}
                        v={withSig(timing.keltnerSignal, timing.keltnerEvent)}
                      />
                    )}
                  </>
                )}
              </ScrollView>

              <TouchableOpacity
                onPress={onClose}
                style={[styles.rightBtn, styles.rightBtnFloating]}
                accessibilityRole="button"
                accessibilityLabel="닫기"
              >
                <Text style={styles.rightBtnText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    overflow: "hidden",
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
  rightBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  rightBtnText: { fontSize: 12, color: "#333" },
  content: {
    padding: 16,
    paddingBottom: 37,
  },
  rightBtnFloating: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  row: { flexDirection: "row", marginBottom: 12 },
  rowKey: { width: 110, color: "#444444ff" },
  rowVal: { flex: 1, color: "#050505ff" },
  empty: { color: "#666" },
});

export default IntradayTimingModal;
