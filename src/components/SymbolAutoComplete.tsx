// src/components/SymbolAutoComplete.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StockItem } from "../types/trade";
import { useServerSymbolSearch } from "../hooks/useSymbolSearch";

interface Props {
  onSelect: (stock: StockItem) => void; // 서버 종목 그대로 반환 (id, name, symbol)
  initialValue?: string;
}

const SymbolAutoComplete: React.FC<Props> = ({ onSelect, initialValue = "" }) => {
  const { query, setQuery, filteredList } = useServerSymbolSearch(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSelect = (stock: StockItem) => {
    setQuery(stock.name);
    onSelect(stock);
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        placeholder="종목명 또는 코드 검색"
        style={styles.input}
      />
      {isFocused && filteredList.length > 0 && (
        <View style={styles.listContainer}>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
            {filteredList.map((item) => (
              <TouchableOpacity
                key={`${item.id}-${item.symbol}`}
                onPress={() => handleSelect(item)}
                style={styles.item}
              >
                <Text>
                  {item.name} ({item.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 8,
    padding: 4,
  },
  listContainer: {
    position: "absolute",
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    maxHeight: 200,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default SymbolAutoComplete;
