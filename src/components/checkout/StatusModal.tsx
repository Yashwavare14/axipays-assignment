import type { PaymentStatus } from "../../types";

interface StatusModalProps {
  status: PaymentStatus;
  onClose: () => void;
  blobUrl?: string;
}

const statusConfig = {
  Success: {
    icon: "✅",
    title: "Payment Successful",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  Failed: {
    icon: "❌",
    title: "Payment Failed",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  Pending: {
    icon: null,
    title: "Payment Pending",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
};

export default function StatusModal({ status, onClose, blobUrl }: StatusModalProps) {
  if (!status) return null;

  const config = statusConfig[status];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border ${config.border}`}>

        {/* Header */}
        <div className={`${config.bg} px-6 py-4 flex items-center justify-between border-b ${config.border}`}>
          <div className="flex items-center gap-3">
            {status === "Pending" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-yellow-200 border-t-yellow-500" />
            ) : (
              <span className="text-2xl">{config.icon}</span>
            )}
            <h2 className={`text-lg font-bold ${config.color}`}>
              {config.title}
            </h2>
          </div>

          {/* Status badge */}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.badge}`}>
            {status}
          </span>
        </div>

        {/* Iframe — shows the same blob URL opened in the new tab */}
        {blobUrl ? (
          <iframe
            src={blobUrl}
            className="w-full h-80 border-0"
            title="Payment Result"
            // No sandbox restrictions needed — blob URL is same origin
          />
        ) : (
          // Fallback if blob URL is empty (e.g. fetch failed)
          <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
            {status === "Pending"
              ? "Loading payment result..."
              : "Gateway response not available"}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {status === "Success" && "✅ Your payment has been processed."}
            {status === "Failed" && "❌ Your payment could not be completed."}
            {status === "Pending" && "⏳ Please wait while we confirm your payment."}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}