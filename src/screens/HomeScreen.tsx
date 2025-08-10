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
import TransactionModal from "../components/TransactionModal";
import { Transaction } from "../models/Transaction";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../storage/transactionStorage";

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
  };
};

type TransactionsData = Record<string, Transaction[]>;

const getToday = () => new Date().toISOString().split("T")[0];

const HomeScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [allTransactions, setAllTransactions] = useState<TransactionsData>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate.slice(0, 7));

  useEffect(() => {
    const loadData = async () => {
      const data = await getTransactions();
      setAllTransactions(data);
    };
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingTransaction(null);
    setIsModalVisible(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTransaction(null);
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleAddOrUpdateTransaction = useCallback(
    async (tx: Omit<Transaction, "id"> | Transaction) => {
      if ("id" in tx) {
        // Update
        await updateTransaction(tx);
        setAllTransactions((prev) => {
          const updatedTxs = (prev[tx.date] || []).map((t) =>
            t.id === tx.id ? tx : t
          );
          return { ...prev, [tx.date]: updatedTxs };
        });
      } else {
        // Create
        const newTransaction = await addTransaction(tx);
        setAllTransactions((prev) => ({
          ...prev,
          [newTransaction.date]: [
            ...(prev[newTransaction.date] || []),
            newTransaction,
          ],
        }));
      }
    },
    []
  );

  const handleDeleteTransaction = useCallback(
    async (txId: string, txDate: string) => {
      await deleteTransaction(txId, txDate);
      setAllTransactions((prev) => {
        const newAllTransactions = { ...prev };
        const updatedDateTxs = newAllTransactions[txDate].filter(
          (t) => t.id !== txId
        );
        if (updatedDateTxs.length > 0) {
          newAllTransactions[txDate] = updatedDateTxs;
        } else {
          delete newAllTransactions[txDate];
        }
        return newAllTransactions;
      });
    },
    []
  );

  const markedDates = useMemo((): MarkedDates => {
    const marked: MarkedDates = {};
    for (const date in allTransactions) {
      if (allTransactions[date].length > 0) {
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
  }, [allTransactions, selectedDate]);

  const selectedDateTransactions = useMemo(() => {
    return allTransactions[selectedDate] || [];
  }, [allTransactions, selectedDate]);

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => openEditModal(item)}
      style={styles.itemBox}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>
          {item.name} ({item.symbol})
        </Text>
        <Text style={item.type === "buy" ? styles.buyText : styles.sellText}>
          {item.type === "buy" ? "매수" : "매도"}
        </Text>
      </View>
      <Text style={styles.itemDetail}>거래 시간: {item.time}</Text>
      <Text style={styles.itemDetail}>
        수량: {item.quantity} / 단가: {item.price.toLocaleString()}원
      </Text>
      {item.type === "sell" && item.avgBuyPrice && (
        <Text style={styles.itemDetail}>
          매수평단가: {item.avgBuyPrice.toLocaleString()}원
        </Text>
      )}
      {item.memo ? (
        <Text style={styles.itemMemo}>메모: {item.memo}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 달력 */}
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        onMonthChange={(month) => {
          setCurrentMonth(
            `${month.year}-${String(month.month).padStart(2, "0")}`
          );
        }}
        markedDates={markedDates}
        monthFormat={"yyyy년 M월"}
        theme={{
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          selectedDayBackgroundColor: "#FFCC00",
          selectedDayTextColor: "#645B4C",
          todayTextColor: "#FFCC00",
          dayTextColor: "#645B4C",
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
          data={selectedDateTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>거래 내역이 없습니다.</Text>
          }
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingTop: 0 }}
        />
      </View>
      <TransactionModal
        visible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateTransaction}
        onDelete={handleDeleteTransaction}
        mode={editingTransaction ? "edit" : "create"}
        initialData={editingTransaction || undefined}
        date={selectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  buyText: {
    color: "#e53935",
    fontWeight: "bold",
  },
  sellText: {
    color: "#1e88e5",
    fontWeight: "bold",
  },
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
