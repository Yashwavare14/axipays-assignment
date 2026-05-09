import type { PaymentStatus } from "../../types";

interface StatusModalProps {
  status: PaymentStatus;
  onClose: () => void;
  redirectUrl?: string;
}

const statusConfig = {
  Success: {
    icon: "✅",
    title: "Payment Successful",
    message: "Your transaction has been completed.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Failed: {
    icon: "❌",
    title: "Payment Failed",
    message: "Something went wrong. Please try again.",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  Pending: {
    icon: "⏳",
    title: "Payment Pending",
    message: "Your payment is being processed.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
};

export default function StatusModal({ status, onClose, redirectUrl }: StatusModalProps) {
  if (!status) return null;

  const config = statusConfig[status];

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border ${config.border}`}>
        <div className="text-center">
          <span className="text-5xl">{config.icon}</span>
          <h2 className={`text-xl font-bold mt-4 ${config.color}`}>{config.title}</h2>
          <p className="text-gray-600 mt-2 text-sm">{config.message}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}