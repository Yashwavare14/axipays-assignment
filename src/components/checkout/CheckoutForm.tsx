import { useState } from "react";
import type { CheckoutFormData, PaymentStatus } from "../../types";
import { checkoutSchema } from "../../utils/checkoutSchema";
import { generateHash } from "../../utils/hash";
import { formatCardDisplay } from "../../utils/maskCard";
import { initiatePayment } from "../../utils/api";
import StatusModal from "./StatusModal";
import { CURRENCIES, COUNTRIES, EXPIRY_MONTHS, EXPIRY_YEARS } from "../../constants";

const initialState: CheckoutFormData = {
  cardHolderName: "",
  email: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  amount: "",
  currency: "USD",
  country: "",
  address: "",
  phone: "",
};

export default function CheckoutForm() {
  const [form, setForm] = useState<CheckoutFormData>(initialState);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(null);
  const [showModal, setShowModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = (): boolean => {
    const result = checkoutSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Partial<CheckoutFormData> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof CheckoutFormData | undefined;
      if (key && !newErrors[key]) {
        newErrors[key] = issue.message;
      }
    });

    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const hash = await generateHash(form.cardNumber, form.email);
      const result = await initiatePayment(form, hash);

      setRedirectUrl(result.redirection_url);

      // Listen for status message from redirect page
      const handleMessage = (event: MessageEvent) => {
        const { status: redirectStatus } = event.data;
        if (["Success", "Failed", "Pending"].includes(redirectStatus)) {
          setStatus(redirectStatus as PaymentStatus);
        }
      };

      window.addEventListener("message", handleMessage);

      // Open redirect URL in new tab
      window.open(result.redirection_url, "_blank");

      // Show modal immediately with Pending status
      setStatus("Pending");
      setShowModal(true);

      // Cleanup listener after 5 minutes (300000ms)
      const timeout = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
      }, 300000);

      // Return cleanup function
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("message", handleMessage);
      };

    } catch (err) {
      console.error(err);
      setStatus("Failed");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-gray-600 text-sm">Complete your payment safely</p>
        </div>

        {/* Card Holder Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Holder Name
          </label>
          <input
            name="cardHolderName"
            value={form.cardHolderName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {errors.cardHolderName && (
            <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Card Number */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Number
          </label>
          <input
            name="cardNumber"
            value={formatCardDisplay(form.cardNumber)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\s/g, "").slice(0, 16);
              setForm((prev) => ({ ...prev, cardNumber: raw }));
              setErrors((prev) => ({ ...prev, cardNumber: "" }));
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
            <select
              name="expiryMonth"
              value={form.expiryMonth}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">MM</option>
              {EXPIRY_MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select
              name="expiryYear"
              value={form.expiryYear}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">YYYY</option>
              {EXPIRY_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
            <input
              name="cvv"
              type="password"
              value={form.cvv}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setForm((prev) => ({ ...prev, cvv: val }));
              }}
              placeholder="•••"
              maxLength={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Amount + Currency */}
        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="100.00"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Country */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Pay Now"
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>

      {/* Status Modal */}
      {showModal && (
        <StatusModal
          status={status}
          onClose={() => setShowModal(false)}
          redirectUrl={redirectUrl}
        />
      )}
    </div>
  );
}