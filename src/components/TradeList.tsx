import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Trade } from "../types/trade";

interface Props {
  Trades: Trade[];
  onTradePress: (trade: Trade) => void;
}

const TradeList: React.FC<Props> = ({ Trades, onTradePress }) => {
  const renderItem = ({ item }: { item: Trade }) => {
    const isBuy = item.type === "BUY";
    const qty = item.quantity ?? 0;
    const price = item.price ?? 0;

    // 실현손익: SELL일 때만 계산, avgBuyPrice가 null이 아닐 때만
    let profitLoss: number | null = null;
    if (item.type === "SELL" && item.avgBuyPrice != null) {
      profitLoss = (price - item.avgBuyPrice) * qty;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onTradePress(item)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={isBuy ? styles.buyText : styles.sellText}>
            {isBuy ? "매수" : "매도"}
          </Text>
        </View>

        <View style={styles.itemBody}>
          <Text style={styles.itemDetails}>
            {qty}주 @ {price.toLocaleString()}원
          </Text>
          {profitLoss !== null && (
            <Text style={profitLoss >= 0 ? styles.profitText : styles.lossText}>
              (실현손익: {profitLoss.toLocaleString()}원)
            </Text>
          )}
        </View>

        <View style={styles.itemFooter}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.memo && <Text style={styles.memoText}>{item.memo}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (!Trades || Trades.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>거래 내역이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={Trades}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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
    color: "#3067D9",
    fontWeight: "bold",
  },
  sellText: {
    color: "#D94A4A",
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

export default TradeList;
