import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../models/transactionDemo";
import * as Crypto from "expo-crypto";

const TradeS_KEY = "Trades";

type TradesData = Record<string, Transaction[]>;

// Helper to save the entire data object
const saveTrades = async (data: TradesData) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(TradeS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save Trades.", e);
  }
};

export const getTrades = async (): Promise<TradesData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TradeS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error("Failed to fetch Trades.", e);
    return {};
  }
};

export const addTrade = async (
  tx: Omit<Transaction, "id">
): Promise<Transaction> => {
  const allTrades = await getTrades();
  const newTrade: Transaction = {
    ...tx,
    id: await Crypto.randomUUID(),
  };

  const dateTrades = allTrades[newTrade.date] || [];
  allTrades[newTrade.date] = [
    ...dateTrades,
    newTrade,
  ].sort((a, b) => (a.name > b.name ? 1 : -1)); // Sort by name for consistency

  await saveTrades(allTrades);

  return newTrade;
};

export const updateTrade = async (
  updatedTx: Transaction
): Promise<void> => {
  const allTrades = await getTrades();
  const { date, id } = updatedTx;

  if (!allTrades[date]) {
    console.error("updateTrade: Date not found");
    return;
  }

  const txIndex = allTrades[date].findIndex((t) => t.id === id);

  if (txIndex === -1) {
    console.error("updateTrade: Trade ID not found");
    return;
  }

  allTrades[date][txIndex] = updatedTx;
  await saveTrades(allTrades);
};

export const deleteTrade = async (
  txId: string,
  txDate: string
): Promise<void> => {
  const allTrades = await getTrades();

  if (!allTrades[txDate]) {
    console.error("deleteTrade: Date not found");
    return;
  }

  allTrades[txDate] = allTrades[txDate].filter(
    (t) => t.id !== txId
  );

  if (allTrades[txDate].length === 0) {
    delete allTrades[txDate];
  }

  await saveTrades(allTrades);
};
