import type {
  Transaction,
  DashboardMetrics,
  StatusBreakdown,
  VolumeByDate,
  CurrencyBreakdown,
} from "../types";

// ─── Four summary card values ─────────────────────────────────────────────────
export function computeMetrics(transactions: Transaction[]): DashboardMetrics {
  const success = transactions.filter((t) => t.status === "Success");
  const failedOrPending = transactions.filter(
    (t) => t.status === "Failed" || t.status === "Pending"
  );

  return {
    totalTransactions: transactions.length,
    totalSuccessVolume: success.reduce((sum, t) => sum + Number(t.amount), 0),
    totalSuccessCount: success.length,
    totalFailedCount: failedOrPending.length,
  };
}

// ─── Status Donut Chart ───────────────────────────────────────────────────────
export function groupByStatus(transactions: Transaction[]): StatusBreakdown[] {
  const counts = { Success: 0, Failed: 0, Pending: 0 };
  transactions.forEach((t) => {
    if (t.status in counts) counts[t.status]++;
  });
  return (Object.entries(counts) as [Transaction["status"], number][]).map(
    ([status, count]) => ({ status, count })
  );
}

// ─── Volume Over Time Bar Chart ───────────────────────────────────────────────
export function groupByDate(transactions: Transaction[]): VolumeByDate[] {
  const map: Record<string, { volume: number; count: number }> = {};

  transactions.forEach((t) => {
    const date = t.createdAt ? t.createdAt.slice(0, 10) : "Unknown";
    if (!map[date]) map[date] = { volume: 0, count: 0 };
    map[date].volume += Number(t.amount);
    map[date].count += 1;
  });

  return Object.entries(map)
    .map(([date, { volume, count }]) => ({ date, volume, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Currency Distribution Donut Chart ───────────────────────────────────────
export function groupByCurrency(transactions: Transaction[]): CurrencyBreakdown[] {
  const map: Record<string, { volume: number; count: number }> = {};

  transactions.forEach((t) => {
    if (!map[t.currency]) map[t.currency] = { volume: 0, count: 0 };
    map[t.currency].volume += Number(t.amount);
    map[t.currency].count += 1;
  });

  return Object.entries(map)
    .map(([currency, { volume, count }]) => ({ currency, volume, count }))
    .sort((a, b) => b.volume - a.volume);
}
