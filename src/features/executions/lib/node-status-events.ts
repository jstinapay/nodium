import {
  type NodeStatusEvent,
  workflowExecutionChannel,
} from "@/inngest/channels";
import type { StepTools } from "../types";

type PublishNodeStatusParams = NodeStatusEvent & {
  executionId: string;
  step: StepTools;
};

export const publishNodeStatus = async ({
  executionId,
  step,
  ...event
}: PublishNodeStatusParams) => {
  const channel = workflowExecutionChannel({ executionId });

  await step.realtime.publish(
    `node-status-${event.nodeId}-${event.status}`,
    channel.nodeStatus,
    event,
  );
};

export const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unknown node execution error";
};
