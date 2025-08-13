export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: number;                     // 백엔드 PK 그대로 number
  date: string;                    // yyyy-MM-dd
  time: string;                    // HH:mm
  name: string;
  symbol: string;
  type: TradeType;                  // BUY / SELL
  quantity: number | null;
  price: number | null;
  avgBuyPrice: number | null;
  memo: string | null;
}

export interface TradeRequest {
  date: string;                    // yyyy-MM-dd
  time: string;                    // HH:mm
  type: TradeType;
  quantity: number | null;
  price: number | null;
  avgBuyPrice: number | null;
  memo: string | null;
  stockItemId: number;
}

export interface StockItem {
  id: number;
  name: string;
  symbol: string;
}

export type TradeGrouped = Record<string, Trade[]>;
