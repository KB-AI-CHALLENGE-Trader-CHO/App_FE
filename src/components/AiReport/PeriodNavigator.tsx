import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PeriodOption, ReportMode } from "../../types/report";

interface PeriodNavigatorProps {
  mode: ReportMode;
  options: PeriodOption[];
  currentId: number;
  onChange: (id: number) => void;
  onOpen?: () => void | Promise<void>;
}

const PeriodNavigator: React.FC<PeriodNavigatorProps> = ({
  mode,
  options,
  currentId,
  onChange,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentIndex = useMemo(
    () => options.findIndex((o) => o.id === currentId),
    [options, currentId]
  );
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < options.length - 1;
  const currentLabel = options[currentIndex]?.label ?? "-";

  const handlePrev = () => {
    if (!canGoPrev) return;
    onChange(options[currentIndex - 1].id);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    onChange(options[currentIndex + 1].id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowBtn, !canGoPrev && styles.disabled]}
        onPress={handlePrev}
        disabled={!canGoPrev}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={canGoPrev ? "#111" : "#AAA"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.center}
        onPress={async () => {
          try {
            await onOpen?.();
          } finally {
            setIsOpen(true);
          }
        }}
      >
        <Text style={styles.centerText}>{currentLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.arrowBtn, !canGoNext && styles.disabled]}
        onPress={handleNext}
        disabled={!canGoNext}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={canGoNext ? "#111" : "#AAA"}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {mode === "weekly" ? "주차 선택" : "월 선택"}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    item.id === currentId && styles.optionRowActive,
                  ]}
                  onPress={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 12,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabled: { backgroundColor: "#F5F5F5" },
  center: { flex: 1, alignItems: "center" },
  centerText: { fontSize: 16, fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  optionRow: { paddingVertical: 12 },
  optionRowActive: { backgroundColor: "#FAFAFA" },
  optionText: { fontSize: 16, color: "#111" },
  separator: { height: 1, backgroundColor: "#EEE" },
  closeBtn: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#FFCC00",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: { fontWeight: "600" },
});

export default PeriodNavigator;
