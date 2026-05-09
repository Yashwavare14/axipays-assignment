import type { CheckoutFormData, InitiatePaymentResponse } from "../types";

const API_URL = "https://payment-assignment.onrender.com/initiate-payment";

export async function initiatePayment(
  form: CheckoutFormData,
  hash: string
): Promise<InitiatePaymentResponse> {
  const payload = {
    orderId: `ORDER-${Date.now()}`,
    cardHolderName: form.cardHolderName,
    email: form.email,
    cardNumber: form.cardNumber.replace(/\s/g, ""), // raw, no spaces
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
      "Hash": hash, // HMAC-SHA256 hash goes here
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Payment initiation failed");
  }

  const data = await response.json() as {
    message?: string;
    redirect_url?: string;
    redirection_url?: string;
  };

  const redirectUrl = data.redirect_url || data.redirection_url;
  if (!redirectUrl) {
    throw new Error("No redirection URL in response");
  }

  return {
    message: data.message,
    redirection_url: redirectUrl,
  };
}