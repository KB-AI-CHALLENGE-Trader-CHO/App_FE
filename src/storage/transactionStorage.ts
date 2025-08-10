import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../models/Transaction";
import * as Crypto from "expo-crypto";

const TRANSACTIONS_KEY = "transactions";

type TransactionsData = Record<string, Transaction[]>;

// Helper to save the entire data object
const saveTransactions = async (data: TransactionsData) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save transactions.", e);
  }
};

export const getTransactions = async (): Promise<TransactionsData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error("Failed to fetch transactions.", e);
    return {};
  }
};

export const addTransaction = async (
  tx: Omit<Transaction, "id">
): Promise<Transaction> => {
  const allTransactions = await getTransactions();
  const newTransaction: Transaction = {
    ...tx,
    id: await Crypto.randomUUID(),
  };

  const dateTransactions = allTransactions[newTransaction.date] || [];
  allTransactions[newTransaction.date] = [
    ...dateTransactions,
    newTransaction,
  ].sort((a, b) => (a.name > b.name ? 1 : -1)); // Sort by name for consistency

  await saveTransactions(allTransactions);

  return newTransaction;
};

export const updateTransaction = async (
  updatedTx: Transaction
): Promise<void> => {
  const allTransactions = await getTransactions();
  const { date, id } = updatedTx;

  if (!allTransactions[date]) {
    console.error("updateTransaction: Date not found");
    return;
  }

  const txIndex = allTransactions[date].findIndex((t) => t.id === id);

  if (txIndex === -1) {
    console.error("updateTransaction: Transaction ID not found");
    return;
  }

  allTransactions[date][txIndex] = updatedTx;
  await saveTransactions(allTransactions);
};

export const deleteTransaction = async (
  txId: string,
  txDate: string
): Promise<void> => {
  const allTransactions = await getTransactions();

  if (!allTransactions[txDate]) {
    console.error("deleteTransaction: Date not found");
    return;
  }

  allTransactions[txDate] = allTransactions[txDate].filter(
    (t) => t.id !== txId
  );

  if (allTransactions[txDate].length === 0) {
    delete allTransactions[txDate];
  }

  await saveTransactions(allTransactions);
};
