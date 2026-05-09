import { z } from "zod";
import { luhnCheck } from "./luhn";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-]{7,15}$/;

export const checkoutSchema = z
  .object({
    cardHolderName: z.string().min(1, "Name is required"),
    email: z.string().regex(emailRegex, "Invalid email"),
    cardNumber: z
      .string()
      .min(13, "Invalid card number")
      .refine((value) => luhnCheck(value.replace(/\s/g, "")), {
        message: "Invalid card number",
      }),
    expiryMonth: z.string().min(1, "Select month"),
    expiryYear: z.string().min(1, "Select year"),
    cvv: z.string().min(3, "Invalid CVV").max(4, "Invalid CVV"),
    amount: z
      .string()
      .refine((value) => {
        const amount = Number(value);
        return value.trim().length > 0 && !Number.isNaN(amount) && amount > 0;
      }, {
        message: "Invalid amount",
      }),
    currency: z.string().min(1, "Select currency"),
    country: z.string().min(1, "Select country"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().regex(phoneRegex, "Invalid phone"),
  })
  .superRefine((data, ctx) => {
    if (data.expiryMonth && data.expiryYear) {
      const month = Number(data.expiryMonth);
      const year = Number(data.expiryYear);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (Number.isNaN(month) || month < 1 || month > 12) {
        ctx.addIssue({
          path: ["expiryMonth"],
          code: z.ZodIssueCode.custom,
          message: "Invalid month",
        });
      }

      if (Number.isNaN(year) || year < currentYear) {
        ctx.addIssue({
          path: ["expiryYear"],
          code: z.ZodIssueCode.custom,
          message: "Card expired",
        });
      } else if (year === currentYear && month < currentMonth) {
        ctx.addIssue({
          path: ["expiryMonth"],
          code: z.ZodIssueCode.custom,
          message: "Card expired",
        });
      }
    }
  });
