/**
 * Minimal structured logger for Vercel.
 * Vercel captures console output and makes it searchable.
 * Structured JSON format enables filtering in Vercel dashboard.
 *
 * IMPORTANT: Never log PII (emails, names, payment identifiers).
 * Use opaque identifiers (userId, subscriptionId) only.
 */
function log(level, event, data = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (event, data) => log("info", event, data),
  warn: (event, data) => log("warn", event, data),
  error: (event, data) => log("error", event, data),
};
