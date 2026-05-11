import type { CheckoutFormData, InitiatePaymentResponse, Transaction } from "../types";
import type { PaymentStatus } from "../types";

const API_URL = "https://payment-assignment.onrender.com/initiate-payment";

export async function initiatePayment(
  form: CheckoutFormData,
  hash: string,
  orderId: string
): Promise<InitiatePaymentResponse> {
  const payload = {
    orderId,
    cardHolderName: form.cardHolderName,
    email: form.email,
    cardNumber: form.cardNumber.replace(/\s/g, ""),
    expiryMonth: form.expiryMonth,
    expiryYear: form.expiryYear,
    cardCVC: form.cvv,
    amount: parseFloat(form.amount),
    currency: form.currency,
    country: form.country,
    address: form.address,
    phone: form.phone,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Hash: hash,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Payment initiation failed");
  }

  const data = (await response.json()) as {
    message?: string;
    redirect_url?: string;
    redirection_url?: string;
  };

  const redirectUrl = data.redirect_url || data.redirection_url;
  if (!redirectUrl) throw new Error("No redirection URL in response");

  return {
    message: data.message,
    redirection_url: redirectUrl,
  };
}

/**
 * Fetch the redirect URL exactly ONE time.
 *
 * Since the gateway assigns a random status on every request,
 * we fetch it once and reuse the same HTML response for:
 *   1. Parsing the payment status → shown in modal header
 *   2. Blob URL → opened in new tab via window.open
 *   3. Blob URL → loaded in iframe inside the modal
 *
 * All three come from the same single response — always in sync.
 */
export async function fetchAndParseRedirect(redirectUrl: string): Promise<{
  status: PaymentStatus;
  blobUrl: string;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(redirectUrl, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Read body ONCE as text
    const html = await response.text();

    // Parse status from that same HTML
    const lower = html.toLowerCase();
    let status: PaymentStatus = "Pending";
    if (lower.includes("success")) status = "Success";
    else if (lower.includes("failed") || lower.includes("failure")) status = "Failed";

    // Convert HTML to a Blob URL
    // This same URL is used for both the new tab and the iframe
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);

    return { status, blobUrl };

  } catch (err) {
    clearTimeout(timeout);
    console.warn("fetchAndParseRedirect error:", err);
    return { status: "Pending", blobUrl: "" };
  }
}

function normalizeStatus(value: unknown): Transaction["status"] {
  const status = String(value ?? "").toLowerCase();
  if (status === "success") return "Success";
  if (status === "failed") return "Failed";
  if (status === "pending") return "Pending";
  return "Pending";
}

function normalizeTransaction(item: unknown): Transaction {
  const txn = item as Record<string, unknown>;
  return {
    orderId: String(txn.orderId ?? ""),
    cardNumber: String(txn.cardNumber ?? ""),
    email: String(txn.email ?? ""),
    expiryMonth: String(txn.expiryMonth ?? ""),
    expiryYear: String(txn.expiryYear ?? ""),
    cardCVC: String(txn.cardCVC ?? ""),
    amount: Number(txn.amount ?? 0),
    currency: String(txn.currency ?? ""),
    status: normalizeStatus(txn.status),
    createdAt: typeof txn.createdAt === "string" ? txn.createdAt : undefined,
  };
}

/**
 * Fetch transactions from the dashboard API
 */
export async function fetchTransactions(
  page: number = 1,
  limit: number = 100
): Promise<Transaction[]> {
  const TRANSACTIONS_URL = "https://payment-assignment.onrender.com/transactions";
  const url = `${TRANSACTIONS_URL}?page=${page}&limit=${limit}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status}`);
  }

  const data = await response.json();
  const raw = (data?.data ?? data ?? []) as unknown;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map(normalizeTransaction);
}