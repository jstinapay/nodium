"use client";

import { useRealtime } from "inngest/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import {
  type NodeStatusEvent,
  workflowExecutionChannel,
} from "@/inngest/channels";
import { nodeStatusesAtom } from "../store/atoms";

const topics = ["nodeStatus"] as const;

const getRealtimeToken = async (executionId: string) => {
  const response = await fetch(
    `/api/realtime/workflow-token?executionId=${encodeURIComponent(executionId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to create realtime subscription token");
  }

  return response.json();
};

export const useWorkflowNodeStatusSubscription = (
  executionId: string | null,
) => {
  const setNodeStatuses = useSetAtom(nodeStatusesAtom);
  const channel = executionId
    ? workflowExecutionChannel({ executionId })
    : undefined;

  const realtime = useRealtime({
    channel,
    topics,
    key: executionId || "idle",
    enabled: Boolean(executionId),
    token: executionId ? () => getRealtimeToken(executionId) : undefined,
  });

  useEffect(() => {
    if (executionId) {
      setNodeStatuses({});
      return;
    }

    setNodeStatuses({});
  }, [executionId, setNodeStatuses]);

  useEffect(() => {
    if (!executionId) {
      return;
    }

    for (const message of realtime.messages.delta) {
      if (message.kind !== "data" || message.topic !== "nodeStatus") {
        continue;
      }

      const event = message.data as NodeStatusEvent;
      setNodeStatuses((current) => ({
        ...current,
        [event.nodeId]: event.status,
      }));
    }
  }, [executionId, realtime.messages.delta, setNodeStatuses]);

  return realtime;
};

export const useNodeStatus = (nodeId: string): NodeStatus => {
  const nodeStatuses = useAtomValue(nodeStatusesAtom);

  return nodeStatuses[nodeId] || "initial";
};
