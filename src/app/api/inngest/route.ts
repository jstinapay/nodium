// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { executeWorkflow} from "../../../inngest/functions";
import { exec } from "child_process";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});