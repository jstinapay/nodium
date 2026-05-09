"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/editor/hooks/use-node-status";
import { DEFAULT_HTTP_REQUEST_VARIABLE_NAME } from "@/features/executions/lib/node-variable-constants";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, type HttpRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type httpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<httpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getNodes, setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus(props.id);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const variableName =
    nodeData?.variableName || DEFAULT_HTTP_REQUEST_VARIABLE_NAME;
  const reservedVariableNames = getNodes()
    .filter((node) => node.id !== props.id)
    .map((node) => (node.data as { variableName?: unknown }).variableName)
    .filter(
      (name): name is string => typeof name === "string" && Boolean(name),
    );
  const description = nodeData?.endpoint
    ? `${variableName} = ${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : `${variableName} = Not configured`;

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
        reservedVariableNames={reservedVariableNames}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
