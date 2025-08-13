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
import { DailyContext } from "../types/analysis";

interface Props {
  visible: boolean;
  onClose: () => void;
  context?: DailyContext;
  onNext?: () => void;
}

const label = {
  trend: "추세 방향",
  maStack: "이평선 배열",
  rsi: "RSI (14일)",
  stochastic: "스토캐스틱",
  bollingerEvent: "볼린저밴드",
  obvSignal: "OBV 신호",
  atrRegime: "ATR",
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

const DailyContextModal: React.FC<Props> = ({ visible, onClose, context, onNext }) => {
  const handleNext = () => {
    onClose();
    onNext?.();
  };

  const withSig = (sig?: string, text?: string | number) =>
    [sig, text].filter(Boolean).join(" ");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>중장기 평가 기준</Text>
                <TouchableOpacity onPress={handleNext} style={styles.rightBtn}>
                  <Text style={styles.rightBtnText}>단기 평가로</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.content}>
                {!context ? (
                  <Text style={styles.empty}>데이터가 없습니다.</Text>
                ) : (
                  <>
                    <Row k={label.trend} v={withSig(context.trendSignal, context.trend)} />
                    <Row k={label.maStack} v={withSig(context.maStackSignal, context.maStack)} />
                    <Row
                      k={label.rsi}
                      v={withSig(
                        context.rsiSignal,
                        `${fmt(context.rsi?.value)} (${context.rsi?.status ?? "-"})`
                      )}
                    />
                    <Row
                      k={label.stochastic}
                      v={withSig(
                        context.stochasticSignal,
                        `${fmt(context.stochastic?.value)} (${context.stochastic?.status ?? "-"})`
                      )}
                    />
                    {context.bollingerEvent && (
                      <Row
                        k={label.bollingerEvent}
                        v={withSig(context.bollingerSignal, context.bollingerEvent)}
                      />
                    )}
                    {context.obvSignal && (
                      <Row
                        k={label.obvSignal}
                        v={withSig(context.obvSignalSignal, context.obvSignal)}
                      />
                    )}
                    {context.atrRegime && (
                      <Row
                        k={label.atrRegime}
                        v={withSig(context.atrRegimeSignal, context.atrRegime)}
                      />
                    )}
                    {context.keltnerEvent && (
                      <Row
                        k={label.keltnerEvent}
                        v={withSig(context.keltnerSignal, context.keltnerEvent)}
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
    backgroundColor: "#F9FAFB",
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

export default DailyContextModal;
