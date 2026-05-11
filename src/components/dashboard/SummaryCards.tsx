import type { DashboardMetrics } from "../../types";

interface Props {
  metrics: DashboardMetrics;
  isLoading: boolean;
}

const getCards = (metrics: DashboardMetrics) => [
  {
    label: "Total Transactions",
    value: metrics.totalTransactions.toLocaleString(),
    icon: "🧾",
    accent: "border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    label: "Total Success Volume",
    value: `$${metrics.totalSuccessVolume.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    icon: "💰",
    accent: "border-green-400",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  {
    label: "Total Success Count",
    value: metrics.totalSuccessCount.toLocaleString(),
    icon: "✅",
    accent: "border-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    label: "Failed + Pending Count",
    value: metrics.totalFailedCount.toLocaleString(),
    icon: "⚠️",
    accent: "border-red-400",
    bg: "bg-red-50",
    text: "text-red-700",
  },
];

export default function SummaryCards({ metrics, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {getCards(metrics).map((card, index) => (
        <div
          key={card.label}
          style={{ animationDelay: `${index * 80}ms` }}
          className={`rounded-2xl border-l-4 ${card.accent} ${card.bg} p-5 shadow-sm animate-fade-in-up`}
        >
          <div className="text-2xl mb-2">{card.icon}</div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {card.label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${card.text}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
