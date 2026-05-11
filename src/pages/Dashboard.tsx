import { useState, useEffect, useCallback } from "react";
import type {
  Transaction,
  DashboardMetrics,
  StatusBreakdown,
  VolumeByDate,
  CurrencyBreakdown,
} from "../types";
import { fetchTransactions } from "../utils/api";
import {
  computeMetrics,
  groupByStatus,
  groupByDate,
  groupByCurrency,
} from "../utils/transactionMetrics";
import {
  loadLocalTransactions,
  mergeTransactions,
} from "../utils/localTransactions";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import StatusDonutChart from "../components/dashboard/StatusDonutChart";
import VolumeChart from "../components/dashboard/VolumeChart";
import CurrencyDonutChart from "../components/dashboard/CurrencyDonutChart";
import TransactionTable from "../components/dashboard/TransactionTable";
import TableSkeleton from "../components/dashboard/TableSkeleton";

const ROWS_PER_PAGE = 10;

const EMPTY_METRICS: DashboardMetrics = {
  totalTransactions: 0,
  totalSuccessVolume: 0,
  totalSuccessCount: 0,
  totalFailedCount: 0,
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS);
  const [statusData, setStatusData] = useState<StatusBreakdown[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeByDate[]>([]);
  const [currencyData, setCurrencyData] = useState<CurrencyBreakdown[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const localTxns = loadLocalTransactions();
      let remoteTxns: Transaction[] = [];

      try {
        remoteTxns = await fetchTransactions(1, 100);
      } catch (err) {
        console.warn("Could not fetch remote transactions:", err);
      }

      const txns = mergeTransactions(remoteTxns, localTxns);
      console.log(`Loaded ${remoteTxns.length} remote and ${localTxns.length} local transactions. Merged total: ${txns.length}`);
      setTransactions(txns);

      // Compute metrics
      const m = computeMetrics(txns);
      setMetrics(m);

      // Compute chart data
      setStatusData(groupByStatus(txns));
      setVolumeData(groupByDate(txns));
      setCurrencyData(groupByCurrency(txns));

      // Reset to page 1 when data reloads
      setCurrentPage(1);

      if (remoteTxns.length === 0 && localTxns.length === 0) {
        setError("Failed to load transactions");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load transactions";
      setError(message);
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardHeader isLoading={isLoading} onRefresh={loadData} />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          ⚠️ {error} — Please refresh the page or try again.
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards metrics={metrics} isLoading={isLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatusDonutChart data={statusData} />
        <VolumeChart data={volumeData} />
        <CurrencyDonutChart data={currencyData} />
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Transaction History
        </h2>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <TransactionTable
              transactions={transactions}
              currentPage={currentPage}
              rowsPerPage={ROWS_PER_PAGE}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Build page number list with ellipsis
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );
  const withEllipsis = visible.reduce<(number | "…")[]>((acc, p, i, arr) => {
    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
    acc.push(p);
    return acc;
  }, []);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                     disabled:opacity-40 hover:bg-gray-50 transition"
        >
          ← Prev
        </button>

        {withEllipsis.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="px-2 py-1.5 text-xs text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 text-xs rounded-lg transition ${
                currentPage === p
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600
                     disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
