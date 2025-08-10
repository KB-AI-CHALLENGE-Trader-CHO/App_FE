import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Transaction } from "../models/Transaction";

interface Props {
  transactions: Transaction[];
  onTransactionPress: (transaction: Transaction) => void;
}

const TransactionList: React.FC<Props> = ({
  transactions,
  onTransactionPress,
}) => {
  const renderItem = ({ item }: { item: Transaction }) => {
    const isBuy = item.type === "buy";
    const profitLoss =
      item.type === "sell" && item.avgBuyPrice
        ? (item.price - item.avgBuyPrice) * item.quantity
        : null;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onTransactionPress(item)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={isBuy ? styles.buyText : styles.sellText}>
            {isBuy ? "매수" : "매도"}
          </Text>
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemDetails}>
            {item.quantity}주 @ {item.price.toLocaleString()}원
          </Text>
          {profitLoss !== null && (
            <Text style={profitLoss >= 0 ? styles.profitText : styles.lossText}>
              (실현손익: {profitLoss.toLocaleString()}원)
            </Text>
          )}
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.timeText}>🕒 {item.time}</Text>
          {item.memo && <Text style={styles.memoText}>📝 {item.memo}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>거래 내역이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buyText: {
    color: "#D94A4A",
    fontWeight: "bold",
  },
  sellText: {
    color: "#3067D9",
    fontWeight: "bold",
  },
  itemBody: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },
  itemDetails: {
    fontSize: 16,
    color: "#333",
  },
  profitText: {
    fontSize: 14,
    color: "#D94A4A",
  },
  lossText: {
    fontSize: 14,
    color: "#3067D9",
  },
  itemFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  memoText: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    flexShrink: 1,
    textAlign: "right",
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});

export default TransactionList;
