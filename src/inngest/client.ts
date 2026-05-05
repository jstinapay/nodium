import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "n2e",
  retryAttempts: 5,
  retryDelayMs: 100,
});