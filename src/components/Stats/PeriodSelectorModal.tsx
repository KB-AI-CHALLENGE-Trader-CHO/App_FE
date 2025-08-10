import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  DateRangeType,
  SelectedPeriod,
  getCurrentPeriod,
} from "../../utils/dateUtils";
import { getWeeklyRanges } from "../../utils/getWeeklyRanges";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (period: SelectedPeriod, type: DateRangeType) => void;
  rangeType: DateRangeType;
  currentPeriod: SelectedPeriod;
}

interface PickerItem {
  label: string;
  value: number | string;
}

const years: PickerItem[] = Array.from({ length: 10 }, (_, i) => {
  const year = getCurrentPeriod().year - i;
  return { label: `${year}년`, value: year };
});
const months: PickerItem[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));

const ITEM_HEIGHT = 48; // 각 항목의 높이 (스타일과 일치시켜야 함)

const PeriodSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  rangeType,
  currentPeriod,
}) => {
  const [tempPeriod, setTempPeriod] = useState<SelectedPeriod>(currentPeriod);
  const [weeks, setWeeks] = useState<PickerItem[]>([]);
  const weeksScrollViewRef = useRef<ScrollView>(null);
  const monthsScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTempPeriod(currentPeriod);
  }, [currentPeriod, visible]);

  useEffect(() => {
    if (rangeType === "week") {
      const weekRanges = getWeeklyRanges(tempPeriod.year);
      setWeeks(weekRanges);
    }
  }, [tempPeriod.year, rangeType]);

  // 모달이 열릴 때 선택된 주차/월로 스크롤
  useEffect(() => {
    if (!visible) return;

    const scrollToIndex = (
      ref: React.RefObject<ScrollView | null>,
      data: PickerItem[],
      selectedValue: number | string | undefined
    ) => {
      if (!ref.current || !selectedValue) return;

      setTimeout(() => {
        const index = data.findIndex((item) => item.value === selectedValue);
        if (index > -1) {
          const yOffset = index * ITEM_HEIGHT - ITEM_HEIGHT * 2;
          ref.current?.scrollTo({
            y: yOffset > 0 ? yOffset : 0,
            animated: true,
          });
        }
      }, 100);
    };

    if (rangeType === "week" && weeks.length > 0) {
      scrollToIndex(weeksScrollViewRef, weeks, tempPeriod.week);
    } else if (rangeType === "month") {
      scrollToIndex(monthsScrollViewRef, months, tempPeriod.month);
    }
  }, [visible, weeks, rangeType, tempPeriod]);

  const renderPicker = (
    data: PickerItem[],
    selectedValue: string | number | undefined,
    onSelect: (value: any) => void,
    label: string,
    ref?: React.Ref<ScrollView>
  ) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView
        ref={ref}
        style={styles.pickerScrollView}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
          >
            <Text
              style={[
                styles.pickerItem,
                selectedValue === item.value && styles.pickerItemSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>기간 선택</Text>
          </View>
          <View style={styles.pickerRow}>
            {renderPicker(
              years,
              tempPeriod.year,
              (year) =>
                setTempPeriod({ ...tempPeriod, year, week: 1, month: 1 }),
              "연도"
            )}
            {rangeType === "month" &&
              renderPicker(
                months,
                tempPeriod.month,
                (month) => setTempPeriod({ ...tempPeriod, month }),
                "월",
                monthsScrollViewRef
              )}
            {rangeType === "week" &&
              renderPicker(
                weeks,
                tempPeriod.week,
                (week) => setTempPeriod({ ...tempPeriod, week }),
                "주차",
                weeksScrollViewRef
              )}
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onConfirm(tempPeriod, rangeType)}
          >
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    height: 200,
  },
  pickerContainer: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  pickerScrollView: {
    flex: 1,
    width: "100%",
  },
  pickerItem: {
    fontSize: 18,
    textAlign: "center",
    paddingVertical: 10,
    color: "#888",
    height: ITEM_HEIGHT,
  },
  pickerItemSelected: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PeriodSelectorModal;
