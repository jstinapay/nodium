import { NonRetriableError } from "inngest";
import type { WorkflowContext } from "../types";

const TEMPLATE_PATTERN =
  /\{\{\s*(json\s+)?([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)*)\s*\}\}/g;

const getPathValue = (context: WorkflowContext, path: string) => {
  const parts = path.split(".");
  let value: unknown = context;

  for (const part of parts) {
    if (value === null || typeof value !== "object" || !(part in value)) {
      throw new NonRetriableError(
        `Template variable "${path}" was not found in the workflow context.`,
      );
    }

    value = (value as Record<string, unknown>)[part];
  }

  return value;
};

const stringifyTemplateValue = (
  path: string,
  value: unknown,
  shouldJsonStringify: boolean,
) => {
  if (shouldJsonStringify) {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  throw new NonRetriableError(
    `Template variable "${path}" is an object or array. Use "{{json ${path}}}" to insert it.`,
  );
};

export const renderTemplate = (template: string, context: WorkflowContext) => {
  return template.replace(
    TEMPLATE_PATTERN,
    (_match, jsonPrefix: string | undefined, path: string) => {
      const value = getPathValue(context, path);
      return stringifyTemplateValue(path, value, Boolean(jsonPrefix));
    },
  );
};
