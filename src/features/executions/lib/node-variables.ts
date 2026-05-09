import { NonRetriableError } from "inngest";
import { VARIABLE_NAME_PATTERN } from "./node-variable-constants";

export const normalizeVariableName = (
  variableName: unknown,
  fallback: string,
) => {
  return typeof variableName === "string" && variableName.trim()
    ? variableName.trim()
    : fallback;
};

export const assertValidVariableName = (variableName: string) => {
  if (!VARIABLE_NAME_PATTERN.test(variableName)) {
    throw new NonRetriableError(
      `Invalid variable name "${variableName}". Use letters, numbers, and underscores, and start with a letter or underscore.`,
    );
  }
};

export const assertUniqueVariableNames = (
  nodes: Array<{ id: string; data: unknown }>,
) => {
  const seen = new Map<string, string>();

  for (const node of nodes) {
    if (
      !node.data ||
      typeof node.data !== "object" ||
      !("variableName" in node.data)
    ) {
      continue;
    }

    const variableName = normalizeVariableName(
      (node.data as { variableName?: unknown }).variableName,
      "",
    );

    if (!variableName) {
      continue;
    }

    assertValidVariableName(variableName);

    const existingNodeId = seen.get(variableName);
    if (existingNodeId && existingNodeId !== node.id) {
      throw new NonRetriableError(
        `Duplicate variable name "${variableName}". Each node variable name must be unique in a workflow.`,
      );
    }

    seen.set(variableName, node.id);
  }
};
