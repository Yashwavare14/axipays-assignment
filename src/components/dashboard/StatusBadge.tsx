import type { Transaction } from "../../types";

const styles: Record<Transaction["status"], string> = {
  Success: "bg-green-100 text-green-700 border border-green-200",
  Failed: "bg-red-100 text-red-700 border border-red-200",
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
};

const dot: Record<Transaction["status"], string> = {
  Success: "bg-green-500",
  Failed: "bg-red-500",
  Pending: "bg-amber-500",
};

export default function StatusBadge({ status }: { status: Transaction["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}
