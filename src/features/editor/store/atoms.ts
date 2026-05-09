import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const editorAtom = atom<ReactFlowInstance | null>(null);

export const activeExecutionIdAtom = atom<string | null>(null);

export const nodeStatusesAtom = atom<Record<string, NodeStatus>>({});
