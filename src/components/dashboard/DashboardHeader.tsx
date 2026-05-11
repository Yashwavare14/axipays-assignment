interface Props {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({ isLoading, onRefresh }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Transaction overview and history
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
      >
        <span className={isLoading ? "animate-spin inline-block" : ""}>↻</span>
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
