/**
 * Minimal server-side SDK for Referralmeter (https://referralmeter.com).
 * No dependencies. Needs a global `fetch` (Node 18+, Deno, Bun, Cloudflare Workers, browsers' server runtimes).
 */

const DEFAULT_BASE_URL = "https://referralmeter.com";

/**
 * @param {{ secretKey: string, baseUrl?: string }} opts
 */
export function createClient({ secretKey, baseUrl = DEFAULT_BASE_URL } = {}) {
  if (!secretKey) throw new Error("referralmeter-js: secretKey is required (a Referralmeter sk_… key)");

  async function post(path, body) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const message = (json && json.error && (json.error.message || json.error)) || `Referralmeter API error (${res.status})`;
      throw new Error(typeof message === "string" ? message : JSON.stringify(message));
    }
    return json;
  }

  return {
    /**
     * The server-side twin of `referralmeter.signup()` in the browser script.
     * @param {{ email: string, external_id?: string, referral?: string, ip?: string }} params
     */
    recordSignup(params) {
      return post("/api/v1/referrals", params);
    },

    /**
     * Record a sale for billing Referralmeter doesn't connect to natively.
     * @param {{ event_id: string, amount: number, currency: string, customer_external_id?: string, customer_id?: string, email?: string, kind?: "subscription"|"one_time"|"credits"|"usage", product_id?: string, livemode?: boolean }} params
     */
    recordSale(params) {
      return post("/api/v1/track/sale", params);
    },

    /**
     * Record a refund. Partial refunds claw back the same share of the commission.
     * @param {{ event_id: string, payment_id: string, amount: number }} params
     */
    recordRefund(params) {
      return post("/api/v1/track/refund", params);
    },
  };
}
