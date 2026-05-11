import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VolumeByDate } from "../../types";

function formatDate(dateStr: string): string {
  if (dateStr === "Unknown") return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function VolumeChart({ data }: { data: VolumeByDate[] }) {
  const chartData = data.map((d) => ({
    ...d,
    displayDate: formatDate(d.date),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-72">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Transaction Volume Over Time
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, name) => {
                const num = typeof value === "number" ? value : parseFloat(String(value));
                return [
                name === "volume" ? `$${num.toFixed(2)}` : num,
                name === "volume" ? "Volume" : "Count",
                ];
            }}
            labelFormatter={(label) => `Date: ${label}`}
            />
          <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
