import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSymbolSearch, StockSymbol } from "../hooks/useSymbolSearch";

interface Props {
  onSelect: (stock: StockSymbol) => void;
  initialValue?: string;
}

const SymbolAutoComplete: React.FC<Props> = ({
  onSelect,
  initialValue = "",
}) => {
  const { query, setQuery, filteredList, setFilteredList } =
    useSymbolSearch(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSelect = (stock: StockSymbol) => {
    setQuery(stock.name);
    onSelect(stock);
    setFilteredList([]); // 목록 숨기기
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
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 200 }}
          >
            {filteredList.map((item) => (
              <TouchableOpacity
                key={item.symbol}
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
    zIndex: 1, // 다른 요소 위에 표시되도록
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 8,
    padding: 4,
  },
  listContainer: {
    position: "absolute",
    top: 38, // 입력창 바로 아래
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    maxHeight: 200, // 최대 높이 지정
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default SymbolAutoComplete;
