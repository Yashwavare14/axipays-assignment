import type { Transaction } from "../../types";
import { maskCardForDisplay } from "../../utils/maskCard";
import StatusBadge from "./StatusBadge";

interface Props {
  transactions: Transaction[];
  currentPage: number;
  rowsPerPage: number;
}

export default function TransactionTable({
  transactions,
  currentPage,
  rowsPerPage,
}: Props) {
  const start = (currentPage - 1) * rowsPerPage;
  const pageSlice = transactions.slice(start, start + rowsPerPage);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Card Number</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Expiry</th>
            <th className="px-4 py-3">CVC</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {pageSlice.map((txn) => (
            <tr
              key={txn.orderId}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-700">
                {txn.orderId}
              </td>
              <td className="px-4 py-3 font-mono text-xs tracking-widest text-gray-600">
                {maskCardForDisplay(txn.cardNumber)}
              </td>
              <td className="px-4 py-3 text-gray-700">{txn.email}</td>
              <td className="px-4 py-3 text-gray-600">
                {txn.expiryMonth} / {txn.expiryYear}
              </td>
              {/* CVV — always hardcoded, never read from txn.cardCVC */}
              <td className="px-4 py-3 font-mono text-gray-400 tracking-widest">
                ***
              </td>
              <td className="px-4 py-3 text-gray-700">
                {Number(txn.amount).toFixed(2)}
              </td>
              <td className="px-4 py-3 font-medium text-gray-600">
                {txn.currency}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={txn.status} />
              </td>
            </tr>
          ))}

          {pageSlice.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="text-center py-12 text-gray-400 text-sm"
              >
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
