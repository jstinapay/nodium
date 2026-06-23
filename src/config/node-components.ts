import { NodeTypes } from '@xyflow/react';
import { NodeType } from "@/generated/prisma/browser";
import { InitialNode } from '@/components/initial-node';
import { HttpRequestNode } from '@/features/executions/components/http-request/node';
import { ManualTriggerNode } from '@/features/triggers/components/manual-trigger/node';
import { GoogleFormTrigger } from '@/features/triggers/components/google-form-trigger/node';
import { StripeTriggerNode } from '@/features/triggers/components/stripe-trigger/node';


export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode, // Replace with actual ManualTriggerNode component
    [NodeType.HTTP_REQUEST]: HttpRequestNode, // Replace with actual HttpRequestNode component
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger, // Replace with actual GoogleFormTrigger component
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode, // Replace with actual StripeTrigger component
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;

