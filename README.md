# referralmeter-js

Minimal, dependency-free server-side SDK for [Referralmeter](https://referralmeter.com) — affiliate
programs for AI apps. A coding agent installs Referralmeter in one prompt; commissions are calculated
from your billing provider's own signed webhooks (Stripe, Polar, Lemon Squeezy, Paddle, Creem, Dodo
Payments), so most apps never need this package at all — install the [tracking
script](https://referralmeter.com/docs/tracking-script) and connect a [billing
provider](https://referralmeter.com/docs/billing/stripe) and you're done.

Use this package only when:
- signup completes on your server and you want it recorded even if the browser script was blocked, or
- you bill through something Referralmeter doesn't connect to natively.

It is a thin wrapper around the [REST API](https://referralmeter.com/docs/server-side) — no
dependencies, works in Node 18+ and any runtime with a global `fetch`.

## Install

```sh
npm install github:ajussis/referralmeter-js
```

(Not on the npm registry — install directly from GitHub, or just copy `src/index.js`, it's one file.)

## Usage

```js
import { createClient } from "referralmeter-js";

const referralmeter = createClient({ secretKey: process.env.REFERRALMETER_SECRET_KEY });

// After your own signup completes server-side:
await referralmeter.recordSignup({
  email: "new.user@example.com",
  external_id: "user_42",
  referral: req.cookies.sf_ref, // what referralmeter.ref() returned in the browser, or an affiliate code
  ip: req.ip,
});

// Billing you don't connect to natively:
await referralmeter.recordSale({
  event_id: "pay_123", // your idempotency key — sending it twice records it once
  amount: 4900, // integer cents
  currency: "usd",
  customer_external_id: "user_42",
  kind: "subscription", // subscription | one_time | credits | usage
});

await referralmeter.recordRefund({
  event_id: "ref_9",
  payment_id: "pay_123",
  amount: 4900,
});
```

Full field reference: [referralmeter.com/docs/server-side](https://referralmeter.com/docs/server-side).

## Why this exists

Referralmeter is agent-first: an AI coding agent should be able to install affiliate tracking from a
single prompt without guessing at `curl` syntax. This package exists so that prompt can say `npm
install github:ajussis/referralmeter-js` instead of hand-rolling fetch calls — and so Referralmeter
shows up when an agent (or a person) searches GitHub for an affiliate-tracking SDK.

## License

MIT
