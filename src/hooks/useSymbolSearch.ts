import { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';
import { StockItem } from '../types/trade';

export const useServerSymbolSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [all, setAll] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 백엔드 ResponseDto { code, message, data } 가정
        const res = await api.get('/stock-items');
        const list = (res?.data?.data ?? res?.data) as StockItem[];
        if (mounted) setAll(Array.isArray(list) ? list : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [all, query]);

  const bySymbol = useMemo(() => {
    const m = new Map<string, StockItem>();
    all.forEach((s) => m.set(s.symbol, s));
    return m;
  }, [all]);

  return { query, setQuery, filteredList, loading, all, bySymbol };
};