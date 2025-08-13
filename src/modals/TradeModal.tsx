import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TradeType, TradeRequest, Trade, StockItem } from "../types/trade";
import SymbolAutoComplete from "../components/SymbolAutoComplete";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

// props 타입 변경
interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    payload:
      | { mode: "create"; request: TradeRequest; display: { name: string; symbol: string } }
      | { mode: "edit"; trade: Trade }
  ) => void;
  onDelete?: (txId: number, txDate: string) => void;
  date: string;
  mode: "create" | "edit";
  initialData?: Trade;
}



const TradeModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  date,
  mode,
  initialData,
}) => {
  const isEdit = mode === "edit";
  const [stock, setStock] = useState<StockItem | null>(null);
  const [type, setType] = useState<TradeType>("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [avgBuyPrice, setAvgBuyPrice] = useState("");
  const [memo, setMemo] = useState("");
  const [time, setTime] = useState(dayjs().format("HH:mm"));

  useEffect(() => {
    if (!visible) return;

    if (isEdit && initialData) {
      // 종목은 다시 선택하지 않아도 기존 값 표시
      setStock(null); // 선택은 비워두고, 표시/저장은 initialData를 우선 사용
      setType(initialData.type);
      setQuantity(
        initialData.quantity != null ? String(initialData.quantity) : ""
      );
      setPrice(initialData.price != null ? String(initialData.price) : "");
      setAvgBuyPrice(
        initialData.avgBuyPrice != null ? String(initialData.avgBuyPrice) : ""
      );
      setMemo(initialData.memo ?? "");
      setTime(initialData.time || dayjs().format("HH:mm"));
    } else {
      setStock(null);
      setType("BUY");
      setQuantity("");
      setPrice("");
      setAvgBuyPrice("");
      setMemo("");
      setTime(dayjs().format("HH:mm"));
    }
  }, [visible, isEdit, initialData]);

  // handleSubmit 내부만 교체
const handleSubmit = () => {
  if (!isEdit && !stock) {
    Alert.alert("입력 오류", "종목을 선택해주세요.");
    return;
  }
  if (!quantity || !price) {
    Alert.alert("입력 오류", "수량과 단가를 모두 입력해주세요.");
    return;
  }

  const qtyNum = Number(quantity);
  const priceNum = Number(price);
  if (Number.isNaN(qtyNum) || Number.isNaN(priceNum)) {
    Alert.alert("입력 오류", "수량/단가는 숫자여야 합니다.");
    return;
  }

  const avgNum =
    type === "SELL"
      ? avgBuyPrice.trim()
        ? Number(avgBuyPrice)
        : null
      : null;
  if (type === "SELL" && avgBuyPrice.trim() && Number.isNaN(avgNum as number)) {
    Alert.alert("입력 오류", "평단가는 숫자여야 합니다.");
    return;
  }

  // handleSubmit 내부
  if (isEdit && initialData) {
    const trade: Trade = {
      ...initialData,
      time,
      type,
      quantity: qtyNum,
      price: priceNum,
      avgBuyPrice: avgNum,
      memo: memo || null,
    };
    onSubmit({ mode: "edit", trade });
  } else {
    if (!stock?.id) {
      Alert.alert("입력 오류", "종목 정보를 확인해주세요.");
      return;
    }
    const request: TradeRequest = {
      date,          // yyyy-MM-dd
      time,          // HH:mm
      type,          // 'BUY' | 'SELL'
      quantity: qtyNum,
      price: priceNum,
      avgBuyPrice: avgNum,
      memo: memo || null,
      stockItemId: stock.id,
    };
    onSubmit({ mode: "create", request, display: { name: stock.name, symbol: stock.symbol } });
  }
  
  onClose();
};


  const handleDelete = () => {
    if (isEdit && initialData && onDelete) {
      Alert.alert(
        "삭제 확인",
        `'${initialData.name}' 거래 내역을 삭제하시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            onPress: () => {
              onDelete(initialData.id, initialData.date);
              onClose();
            },
            style: "destructive",
          },
        ]
      );
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    setter: (text: string) => void,
    keyboardType: "numeric" | "default" = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setter}
        placeholder={`${label} 입력`}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEdit ? "거래 수정" : "거래 입력"}
            </Text>
            {isEdit && (
              <TouchableOpacity onPress={handleDelete} style={styles.deleteIcon}>
                <Ionicons name="trash-outline" size={24} color="#e53935" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>거래일</Text>
                <Text style={styles.dateText}>
                  {isEdit && initialData ? initialData.date : date}
                </Text>
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>거래 시간 (HH:mm)</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="10:25"
                  maxLength={5}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, type === "BUY" && styles.typeButtonActive]}
                onPress={() => setType("BUY")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "BUY" && styles.typeButtonTextActive,
                  ]}
                >
                  매수
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === "SELL" && styles.typeButtonActive]}
                onPress={() => setType("SELL")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === "SELL" && styles.typeButtonTextActive,
                  ]}
                >
                  매도
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>종목</Text>
              <SymbolAutoComplete
                onSelect={setStock}
                initialValue={isEdit && initialData ? initialData.name : stock?.name || ""}
              />
            </View>

            {renderInputField("단가 (원)", price, setPrice, "numeric")}
            {renderInputField("수량", quantity, setQuantity, "numeric")}
            {type === "SELL" &&
              renderInputField("평단가 (매수 평균)", avgBuyPrice, setAvgBuyPrice, "numeric")}
            {renderInputField("메모", memo, setMemo)}
          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {isEdit ? "수정 완료" : "저장하기"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#FFCC00",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", flex: 1, color: "#645B4C" },
  content: { padding: 16 },
  inputRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#645B4C" },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#645B4C",
  },
  dateText: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#645B4C",
    overflow: "hidden",
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCC00",
    borderRadius: 8,
    overflow: "hidden",
  },
  typeButton: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "white" },
  typeButtonActive: { backgroundColor: "#FFCC00" },
  typeButtonText: { fontSize: 16, fontWeight: "bold", color: "#645B4C" },
  typeButtonTextActive: { color: "#645B4C" },
  footerButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#f8f9fa", marginRight: 8, borderWidth: 1, borderColor: "#ddd" },
  submitButton: { backgroundColor: "#FFCC00", marginLeft: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  cancelButtonText: { color: "#645B4C" },
  submitButtonText: { color: "#645B4C" },
  deleteIcon: { padding: 4 },
});

export default TradeModal;
