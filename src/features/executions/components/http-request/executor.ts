import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import {
  getErrorMessage,
  publishNodeStatus,
} from "@/features/executions/lib/node-status-events";
import { DEFAULT_HTTP_REQUEST_VARIABLE_NAME } from "@/features/executions/lib/node-variable-constants";
import {
  assertValidVariableName,
  normalizeVariableName,
} from "@/features/executions/lib/node-variables";
import { renderTemplate } from "@/features/executions/lib/template";
import type { NodeExecutor } from "@/features/executions/types";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  variableName?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  executionId,
  context,
  step,
}) => {
  const variableName = normalizeVariableName(
    data.variableName,
    DEFAULT_HTTP_REQUEST_VARIABLE_NAME,
  );
  assertValidVariableName(variableName);

  await publishNodeStatus({
    executionId,
    step,
    nodeId,
    status: "loading",
  });

  if (!data.endpoint) {
    await publishNodeStatus({
      executionId,
      step,
      nodeId,
      status: "error",
      message: "HTTP Request node: No endpoint configured",
    });
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }

  const configuredEndpoint = data.endpoint;

  try {
    const result = await step.run("http-request", async () => {
      const endpoint = renderTemplate(configuredEndpoint, context);
      const method = data.method || "GET";

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        options.body = renderTemplate(data.body || "", context);
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const output = {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      };

      return {
        ...context,
        [variableName]: output,
        httpResponse: output,
      };
    });

    await publishNodeStatus({
      executionId,
      step,
      nodeId,
      status: "success",
      output: result[variableName],
    });

    return result;
  } catch (error) {
    await publishNodeStatus({
      executionId,
      step,
      nodeId,
      status: "error",
      message: getErrorMessage(error),
    });
    throw error;
  }
};
