import { realtime } from "inngest";
import { z } from "zod";

export const workflowExecutionChannel = realtime.channel({
  name: ({ executionId }: { executionId: string }) =>
    `workflow-execution:${executionId}`,
  topics: {
    nodeStatus: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
        message: z.string().optional(),
        output: z.unknown().optional(),
      }),
    },
  },
});

export type NodeStatusEvent =
  (typeof workflowExecutionChannel.$infer)["nodeStatus"];
