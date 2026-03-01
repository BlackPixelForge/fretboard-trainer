import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _redis;
function getRedis() {
  if (!_redis) {
    _redis = Redis.fromEnv();
  }
  return _redis;
}

let _authLimiter;
export function getAuthLimiter() {
  if (!_authLimiter) {
    _authLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "ratelimit:auth",
    });
  }
  return _authLimiter;
}

let _checkoutLimiter;
export function getCheckoutLimiter() {
  if (!_checkoutLimiter) {
    _checkoutLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
      prefix: "ratelimit:checkout",
    });
  }
  return _checkoutLimiter;
}
