import { useState, useEffect } from "react";
import symbols from "../../data/symbols_kr.json";

export interface StockSymbol {
  name: string;
  symbol: string;
}

export const useSymbolSearch = (initialQuery: string = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [filteredList, setFilteredList] = useState<StockSymbol[]>([]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setFilteredList([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    // 검색 성능을 위해 50개로 제한
    const results = symbols
      .filter(
        (stock) =>
          stock.name.toLowerCase().includes(lowerCaseQuery) ||
          stock.symbol.includes(lowerCaseQuery)
      )
      .slice(0, 50);

    setFilteredList(results);
  }, [query]);

  return { query, setQuery, filteredList, setFilteredList };
};
