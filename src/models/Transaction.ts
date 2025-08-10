export type TransactionType = "buy" | "sell";

export interface Transaction {
  id: string; // uuid
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  name: string; // 종목명
  symbol: string; // 종목코드
  type: TransactionType;
  quantity: number;
  price: number;
  avgBuyPrice?: number; // 매도 시에만
  memo?: string;
}
