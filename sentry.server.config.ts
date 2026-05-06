// Import with `import * as Sentry from "@sentry/nextjs"` if you are using ESM
const Sentry = require("@sentry/nextjs");

Sentry.init({
  dsn: "https://4a8dcd9b4ffda6b8127064ec8dd70316@o4511338209869825.ingest.us.sentry.io/4511340766035968",
  // Tracing must be enabled for agent monitoring to work
  tracesSampleRate: 1.0,
  // Add data like inputs and responses to/from LLMs and tools;
  // see https://docs.sentry.io/platforms/javascript/data-management/data-collected/ for more info
  sendDefaultPii: true,
});