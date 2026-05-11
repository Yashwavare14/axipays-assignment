import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StatusBreakdown } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  Success: "#22c55e",
  Failed: "#ef4444",
  Pending: "#f59e0b",
};

export default function StatusDonutChart({ data }: { data: StatusBreakdown[] }) {
  const chartData = data.map((d) => ({ name: d.status, value: d.count }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-72">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Transaction Status Breakdown
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="42%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => {
                const num = typeof value === "number" ? value : parseFloat(String(value));
                return [`${num} txns`, String(name)];
            }}
            />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
