import {
  getErrorMessage,
  publishNodeStatus,
} from "@/features/executions/lib/node-status-events";
import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  executionId,
  context,
  step,
}) => {
  await publishNodeStatus({
    executionId,
    step,
    nodeId,
    status: "loading",
  });

  try {
    const result = await step.run("manual-trigger", async () => context);

    await publishNodeStatus({
      executionId,
      step,
      nodeId,
      status: "success",
      output: result,
    });

    return result;
  } catch (error) {
    await publishNodeStatus({
      executionId,
      step,
      nodeId,
      status: "error",
      message: getErrorMessage(error),
    });
    throw error;
  }
};
