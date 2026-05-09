"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import "@xyflow/react/dist/style.css";
import { useAtomValue, useSetAtom } from "jotai";
import { useTheme } from "next-themes";
import { nodeComponents } from "@/config/node-components";
import { NodeType } from "@/generated/prisma/browser";
import { useWorkflowNodeStatusSubscription } from "../hooks/use-node-status";
import { activeExecutionIdAtom, editorAtom } from "../store/atoms";
import { AddNodeButton } from "./add-node-button";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const { theme } = useTheme();
  const colorMode = theme === "light" || theme === "dark" ? theme : "system";

  const setEditor = useSetAtom(editorAtom);
  const activeExecutionId = useAtomValue(activeExecutionIdAtom);
  useWorkflowNodeStatusSubscription(activeExecutionId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="relative size-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.02),transparent_30%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]">
      <ReactFlow
        className="size-full"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        colorMode={colorMode}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ animated: true }}
        proOptions={{
          hideAttribution: true,
        }}
        onInit={setEditor}
      >
        <Background gap={24} size={1} />
        <Controls className="rounded-xl border bg-background/90 shadow-sm backdrop-blur" />
        <MiniMap className="rounded-xl border bg-background/90 shadow-sm backdrop-blur" />
        <Panel position="top-right" className="m-4">
          <div className="flex items-center gap-2 rounded-xl bg-background/90 p-2 shadow-lg backdrop-blur">
            <AddNodeButton />
          </div>
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
