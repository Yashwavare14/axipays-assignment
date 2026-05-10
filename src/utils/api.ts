import type { CheckoutFormData, InitiatePaymentResponse } from "../types";
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