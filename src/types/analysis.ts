export type IndicatorStatus = string;

export interface IndicatorWithStatus {
  value: number;
  status: IndicatorStatus;
}

export interface DailyContext {
  trend: string;
  maStack: string;
  rsi: IndicatorWithStatus;
  stochastic: IndicatorWithStatus;
  bollingerEvent?: string;
  obvSignal?: string;
  atrRegime?: string;
  keltnerEvent?: string;
}

export interface IntradayTiming {
  trend: string;
  maStack: string;
  rsi: IndicatorWithStatus;
  stochastic: IndicatorWithStatus;
  bollingerEvent?: string;
  volumeZScore?: number;
  keltnerEvent?: string;
}

export interface AnalysisDetails {
  dailyContext?: DailyContext;
  intradayTiming?: IntradayTiming;
}

export interface AnalysisItem {
  id: number;
  date: string;
  time: string;
  stockName: string;
  tradeType: "BUY" | "SELL" | string;
  memo: string | null;
  analysisDetails: AnalysisDetails;
  suggestion?: string | null;
  symbol?: string;
}
