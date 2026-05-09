import toposort from "toposort";
import type { Connection, Node } from "@/generated/prisma/browser";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  const nodeIds = nodes.map((node) => node.id);
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort.array(nodeIds, edges);
    // remove duplicates while preserving order
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (err) {
    if (err instanceof Error && err.message.includes("Cyclic")) {
      throw new Error(
        "This workflow graph contains a cycle. Remove the circular node connection before running the workflow.",
      );
    }
    throw err;
  }
  // map sorted IDs back to nodes
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds
    .map((id) => nodeMap.get(id))
    .filter((node): node is Node => Boolean(node));
};
