import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { WorkflowsError, WorkflowsLoading } from "@/features/workflows/components/workflows";
import { prefetchWorkflow } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
    params: Promise<{ 
        workflowsId: string;
    }>
}

const Page = async ({ params }: PageProps) => {
    await requireAuth();

    const { workflowsId } = await params;
    prefetchWorkflow(workflowsId);
    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />}>
                <Suspense fallback={<EditorLoading />}>
                <EditorHeader workflowId={workflowsId} />
                    <main className="flex-1">
                    <Editor workflowId={workflowsId} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
};

export default Page;