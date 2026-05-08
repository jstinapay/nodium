import { NodeTypes } from '@xyflow/react';
import { NodeType } from "@/generated/prisma/browser";
import { InitialNode } from '@/components/initial-node';
import { HttpRequestNode } from '@/features/executions/components/http-request/node';
import { ManualTriggerNode } from '@/features/triggers/components/manual-trigger/node';


export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode, // Replace with actual ManualTriggerNode component
    [NodeType.HTTP_REQUEST]: HttpRequestNode, // Replace with actual HttpRequestNode component
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;

