import type { Transaction } from "../types";

const STORAGE_KEY = "axipays_local_transactions";

export function loadLocalTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Transaction => {
      return (
        item &&
        typeof item === "object" &&
        typeof (item as Transaction).orderId === "string"
      );
    });
  } catch {
    return [];
  }
}

export function saveLocalTransaction(transaction: Transaction): void {
  const transactions = loadLocalTransactions();
  const next = [transaction, ...transactions.filter((t) => t.orderId !== transaction.orderId)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function mergeTransactions(remote: Transaction[], local: Transaction[]): Transaction[] {
  const byId = new Map<string, Transaction>();
  remote.forEach((txn) => byId.set(txn.orderId, txn));
  local.forEach((txn) => {
    if (!byId.has(txn.orderId)) byId.set(txn.orderId, txn);
  });
  return Array.from(byId.values()).sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}
