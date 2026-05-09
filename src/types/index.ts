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