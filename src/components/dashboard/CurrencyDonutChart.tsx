import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CurrencyBreakdown } from "../../types";

const COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

export default function CurrencyDonutChart({
  data,
}: {
  data: CurrencyBreakdown[];
}) {
  const chartData = data.map((d) => ({
    name: d.currency,
    value: parseFloat(d.volume.toFixed(2)),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-72">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Currency Distribution
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
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
         <Tooltip
            formatter={(value, name) => {
                const num = typeof value === "number" ? value : parseFloat(String(value));
                return [`$${num.toFixed(2)}`, String(name)];
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
