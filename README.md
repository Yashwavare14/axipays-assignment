# AXIPAYS Assignment

## Project Overview

This project is a React + TypeScript payment dashboard and checkout demo built with Vite.
It includes a checkout form, payment status handling, transaction dashboard, charts, and a local persistence fallback for transactions.

## Code Structure

- `src/main.tsx` — app bootstrap and router setup.
- `src/App.tsx` — application shell and route definitions.
- `src/pages/CheckoutPage.tsx` — checkout page wrapper.
- `src/pages/Dashboard.tsx` — dashboard page that loads transactions, metrics, charts, and the transaction table.
- `src/components/checkout/CheckoutForm.tsx` — payment form, validation, submit flow, and status modal.
- `src/components/dashboard/TransactionTable.tsx` — paginated transaction table with masked payment details.
- `src/components/dashboard/StatusBadge.tsx` — colored status badges for Success / Failed / Pending.
- `src/components/dashboard/StatusDonutChart.tsx` — status breakdown chart.
- `src/components/dashboard/CurrencyDonutChart.tsx` — currency distribution chart.
- `src/components/dashboard/VolumeChart.tsx` — volume over time chart.
- `src/components/dashboard/SummaryCards.tsx` — top-level metrics cards.
- `src/utils/api.ts` — API helpers for checkout and fetching transaction data.
- `src/utils/localTransactions.ts` — localStorage persistence for submitted transactions.
- `src/utils/transactionMetrics.ts` — computing dashboard metrics and chart data.
- `src/utils/maskCard.ts` — card formatting and display masking.
- `src/utils/checkoutSchema.ts` — form validation schema.
- `src/types/index.ts` — shared TypeScript data models.

## Application Flow

### Checkout flow

1. User fills the checkout form in `CheckoutForm.tsx`.
2. Form values are validated with `checkoutSchema`.
3. `initiatePayment()` sends a payload to the external payment endpoint.
4. The returned redirect URL is fetched once via `fetchAndParseRedirect()` to determine the final status.
5. A local transaction record is saved via `saveLocalTransaction()`.
6. The user sees the payment status modal and may open the result in a new tab.

### Dashboard flow

1. `Dashboard.tsx` loads remote transactions using `fetchTransactions()` from `api.ts`.
2. It also loads user-submitted transactions from `localStorage` via `loadLocalTransactions()`.
3. Remote and local transactions are merged in `mergeTransactions()`.
4. Metrics are calculated with `computeMetrics()`.
5. Chart data is prepared with `groupByStatus()`, `groupByDate()`, and `groupByCurrency()`.
6. `TransactionTable.tsx` renders the merged dataset with client-side pagination.

## Key Decisions and Assumptions

### Local persistence fallback

- The current payment endpoint is treated as a dummy / non-persistent integration.
- Submitted transactions are stored locally in the browser so they appear immediately on the dashboard.
- Dashboard data is merged with remote API results to preserve both external entries and local entries.

### Status normalization

- Remote API returns lowercase status values such as `success` and `pending`.
- The app normalizes statuses to `Success`, `Failed`, and `Pending` for consistent metrics, badges, and charts.

### Sensitive data handling

- Card numbers are masked in `TransactionTable.tsx` via `src/utils/maskCard.ts`.
- Only the first 6 and last 4 digits are shown.
- CVV is never displayed from the transaction payload and is always rendered as `***`.

### UI / UX choices

- `recharts` is used for dashboard visualizations.
- The dashboard shows a loading skeleton and supports manual refresh.
- The chart legends are arranged to avoid overflow.
- The transaction table is paginated at 10 rows per page.

### Assumptions

- The remote `/transactions` API may be read-only and not persist new checkout submissions reliably.
- The app is a front-end demo without a dedicated server-side transaction store.
- Users run this in modern browsers with `localStorage`, `fetch`, and ES module support.

## Running the Project

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Notes

- Built with Vite, React, TypeScript, Tailwind CSS, and Recharts.
- The app has two main sections: checkout and dashboard.
- Add a real backend persistence layer if you want true transaction storage instead of browser fallback.
'@ | Set-Content -Path README.md -Encoding utf8"