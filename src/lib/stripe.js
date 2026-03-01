import Stripe from "stripe";

let _stripe;

export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }
  return _stripe;
}

// Named export for convenience — lazy getter
export const stripe = new Proxy(
  {},
  {
    get(_, prop) {
      return getStripe()[prop];
    },
  }
);
