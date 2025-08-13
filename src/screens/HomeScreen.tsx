import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import TradeModal from "../modals/TradeModal";
import { Trade, TradeRequest } from "../types/trade";
import api from "../utils/api";

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
  };
};

type TradesData = Record<string, Trade[]>;

const getToday = () => new Date().toISOString().split("T")[0];

// 서버에서 거래 목록 조회 (ResponseDto { data } 가정)
async function getTrades(): Promise<TradesData> {
  const res = await api.get("/trades");
  const body = (res?.data?.data ?? res?.data) as TradesData;
  return body ?? {};
}

const nfmt = (n: number | null | undefined) => (n ?? 0).toLocaleString();

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [allTrades, setAllTrades] = useState<TradesData>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.slice(0, 7));

  useEffect(() => {
    (async () => {
      const data = await getTrades();
      setAllTrades(data);
    })();
  }, []);

  const openCreateModal = () => {
    setEditingTrade(null);
    setIsModalVisible(true);
  };

  const openEditModal = (tx: Trade) => {
    setEditingTrade(tx);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTrade(null);
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // 생성/수정 처리
  const handleAddOrUpdateTrade = useCallback(
    async (
      payload:
        | { mode: "create"; request: TradeRequest; display: { name: string; symbol: string } }
        | { mode: "edit"; trade: Trade }
    ) => {
      if (payload.mode === "create") {
        await api.post("/trades", payload.request);
        const refreshed = await getTrades();
        setAllTrades(refreshed);
      } else {
        const tx = payload.trade;
        // 백엔드 update 미구현 → 로컬 갱신
        setAllTrades((prev) => {
          const list = prev[tx.date] ?? [];
          const next = list.map((t) => (t.id === tx.id ? tx : t));
          return { ...prev, [tx.date]: next };
        });
      }
    },
    []
  );

  const handleDeleteTrade = useCallback(
    async (txId: number, txDate: string) => {
      // 백엔드 delete 미구현 → 로컬 삭제
      setAllTrades((prev) => {
        const list = prev[txDate] ?? [];
        const next = list.filter((t) => t.id !== txId);
        const copy = { ...prev };
        if (next.length > 0) copy[txDate] = next;
        else delete copy[txDate];
        return copy;
      });
    },
    []
  );

  const markedDates = useMemo((): MarkedDates => {
    const marked: MarkedDates = {};
    for (const date in allTrades) {
      if ((allTrades[date]?.length ?? 0) > 0) {
        marked[date] = { marked: true, dotColor: "#FFCC00" };
      }
    }
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: "#FFCC00",
      selectedTextColor: "#645B4C",
    };
    return marked;
  }, [allTrades, selectedDate]);

  const selectedDateTrades = useMemo(() => {
    return allTrades[selectedDate] ?? [];
  }, [allTrades, selectedDate]);

  const renderItem = ({ item }: { item: Trade }) => {
    const isBuy = item.type === "BUY";
    const qty = item.quantity ?? 0;
    const price = item.price ?? 0;
    const avg = item.avgBuyPrice ?? null;

    return (
      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.itemBox}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>
            {item.name} ({item.symbol})
          </Text>
          <Text style={isBuy ? styles.buyText : styles.sellText}>
            {isBuy ? "매수" : "매도"}
          </Text>
        </View>
        <Text style={styles.itemDetail}>거래 시간: {item.time}</Text>
        <Text style={styles.itemDetail}>
          수량: {qty} / 단가: ${nfmt(price)}
        </Text>
        {item.type === "SELL" && avg !== null && (
          <Text style={styles.itemDetail}>
            매수평단가: <Text style={{ fontWeight: "bold" }}>$</Text>{nfmt(avg)}
          </Text>
        )}
        {item.memo ? <Text style={styles.itemMemo}>메모: {item.memo}</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>매매일지</Text>
      </View>

      {/* 달력 */}
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        onMonthChange={(month) => {
          setCurrentMonth(`${month.year}-${String(month.month).padStart(2, "0")}`);
        }}
        markedDates={markedDates}
        monthFormat={"yyyy년 M월"}
        theme={{
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          selectedDayBackgroundColor: "#FFCC00",
          selectedDayTextColor: "#645B4C",
          todayTextColor: "#FFCC00",
          dayTextColor: "#000000",
          textDisabledColor: "#ccc",
          dotColor: "#FFCC00",
          arrowColor: "#645B4C",
          monthTextColor: "#645B4C",
          textMonthFontWeight: "bold",
          textDayFontWeight: "500",
          textDayHeaderFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={{
          borderRadius: 16,
          marginHorizontal: 16,
          marginBottom: 10,
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 4,
        }}
      />

      {/* 매매일지 추가 버튼 */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Text style={styles.addButtonText}>매매일지 추가</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={selectedDateTrades}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>거래 내역이 없습니다.</Text>}
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingTop: 0 }}
        />
      </View>

      <TradeModal
        visible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateTrade}
        onDelete={handleDeleteTrade}
        mode={editingTrade ? "edit" : "create"}
        initialData={editingTrade ?? undefined}
        date={selectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFCC00",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#645B4C",
  },
  itemBox: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#645B4C",
  },
  buyText: { color: "#1e88e5", fontWeight: "bold" },
  sellText: { color: "#e53935", fontWeight: "bold" },
  itemDetail: {
    fontSize: 14,
    color: "#645B4C",
    marginBottom: 4,
  },
  itemMemo: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyText: { color: "#645B4C", textAlign: "center", marginTop: 40 },
  addButtonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: "#FFCC00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#645B4C",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
