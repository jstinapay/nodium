"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"
import { useState, useCallback } from "react"
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type ColorMode,
    Background,
    Controls,
    MiniMap,
    Panel,
    
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
  import { useTheme } from "next-themes";

export const EditorLoading = () => {
    return <LoadingView message = "Loading editor..." />;
}

export const EditorError = () => {
    return <ErrorView message="Error loading editor"/>
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
  const { theme } = useTheme();
  const colorMode = theme === "light" || theme === "dark" ? theme : "system";

      const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
      const [edges, setEdges] = useState<Edge[]>(workflow.edges);

        const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


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
      >
        <Background gap={24} size={1} />
        <Controls className="rounded-xl border bg-background/90 shadow-sm backdrop-blur" />
        <MiniMap className="rounded-xl border bg-background/90 shadow-sm backdrop-blur" />
        <Panel position="top-right" className="m-4">
          <div className="flex items-center gap-2 rounded-xl bg-background/90 p-2 shadow-lg backdrop-blur">
            <AddNodeButton />
          </div>
        </Panel>
       </ReactFlow>
    </div>
  );
}
