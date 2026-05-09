export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "");

  // Must be all digits and at least 13 characters
  if (!/^\d+$/.test(digits) || digits.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  // Iterate from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}