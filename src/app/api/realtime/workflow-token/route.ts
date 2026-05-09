import { getClientSubscriptionToken } from "inngest/react";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { workflowExecutionChannel } from "@/inngest/channels";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const executionId = request.nextUrl.searchParams.get("executionId");

  if (!executionId) {
    return NextResponse.json(
      { error: "Execution ID is required" },
      { status: 400 },
    );
  }

  const token = await getClientSubscriptionToken(inngest, {
    channel: workflowExecutionChannel({ executionId }),
    topics: ["nodeStatus"],
  });

  return NextResponse.json(token);
};
