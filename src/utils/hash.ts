// Using Web Crypto API (works in both browser and Node.js)

function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

async function hmacSHA256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  // Convert ArrayBuffer to uppercase hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export async function generateHash(
  cardNumber: string,
  email: string
): Promise<string> {
  const digits = cardNumber.replace(/\s/g, "");

  // Step 1 & 2: Extract first 6 and last 4
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);

  // Step 3: Concatenate
  const combined = first6 + last4; // 10-digit string

  // Step 4: Reverse the combined string
  const reversedCombined = reverseString(combined);

  // Step 5: Reverse the email
  const reversedEmail = reverseString(email);

  // Step 6: Build the message
  const message = reversedEmail + "AXIPAYS" + reversedCombined;

  // Step 7: Uppercase
  const upperMessage = message.toUpperCase();

  // Step 8: HMAC-SHA256 with secret key, return uppercase hex
  const hash = await hmacSHA256(upperMessage, "AXI2026");

  return hash;
}