import { Connection, Node } from "@/generated/prisma/browser";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {


    if (!connections || connections.length === 0) {
        return nodes;
    }

    // create edges array for toposort
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);
    const connectNodeIds = new Set<string>();
    for (const conn of connections) {
        connectNodeIds.add(conn.fromNodeId);
        connectNodeIds.add(conn.toNodeId);
    }
    
    for (const node of nodes) {
        if (!connectNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        // remove duplicates while preserving order
        sortedNodeIds = [...new Set(sortedNodeIds)];

    } catch (err) {
        if (err instanceof Error && err.message.includes("Cyclic")) {
            throw new Error("Cyclic dependency detected in workflow nodes. Please check your connections.");
        }
        throw err;
    }
    // map sorted IDs back to nodes
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    return sortedNodeIds
        .map((id) => nodeMap.get(id))
        .filter((node): node is Node => Boolean(node));
}



