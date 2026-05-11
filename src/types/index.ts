export interface CheckoutFormData {
  cardHolderName: string;
  email: string;
  cardNumber: string;       // raw, unmasked - never expose to UI
  expiryMonth: string;
  expiryYear: string;
  cvv: string;              // raw - never expose to UI
  amount: string;
  currency: string;
  country: string;
  address: string;
  phone: string;
}

export type PaymentStatus = "Success" | "Failed" | "Pending" | null;

export interface InitiatePaymentResponse {
  redirection_url: string;
  status?: PaymentStatus;
  message?: string;
}

// ─── Dashboard Transaction Types ───────────────────────────────────────────

export interface Transaction {
  orderId: string;
  cardNumber: string;      // raw from API — mask before rendering
  email: string;
  expiryMonth: string;     // e.g. "08"
  expiryYear: string;      // e.g. "2027"
  cardCVC: string;         // raw from API — always render as "***"
  amount: number;
  currency: string;         // e.g. "USD"
  status: "Success" | "Failed" | "Pending";
  createdAt?: string;      // ISO date string — used for Volume Over Time chart
}

export interface DashboardMetrics {
  totalTransactions: number;
  totalSuccessVolume: number;   // sum of amount where status === "Success"
  totalSuccessCount: number;    // count where status === "Success"
  totalFailedCount: number;     // count where status === "Failed" OR "Pending"
}

export interface StatusBreakdown {
  status: "Success" | "Failed" | "Pending";
  count: number;
}

export interface VolumeByDate {
  date: string;      // "2026-05-01"
  volume: number;    // total amount for that date
  count: number;     // number of transactions that date
}

export interface CurrencyBreakdown {
  currency: string;
  volume: number;
  count: number;
}