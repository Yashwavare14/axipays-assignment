// Format raw 16-digit string into display format: 1234 5678 9012 3456
export function formatCardDisplay(raw: string): string {
  return raw.replace(/(.{4})/g, "$1 ").trim();
}

// Mask card number for display in table: show first 6 and last 4
// e.g., "411111######1111"
export function maskCardForTable(raw: string): string {
  const digits = raw.replace(/\s/g, "");
  if (digits.length < 10) return raw;
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const masked = "#".repeat(digits.length - 10);
  return `${first6}${masked}${last4}`;
}

// Mask card number for dashboard display: show first 6 and last 4 only
// e.g., "411111••••••1111"
export function maskCardForDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return "•••• •••• •••• ••••";
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const masked = "•".repeat(digits.length - 10);
  return `${first6}${masked}${last4}`;
}

// Always show CVV as ***
export function maskCVV(): string {
  return "***";
}