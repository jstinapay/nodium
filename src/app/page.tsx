"use client";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const workflowsQuery = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: async (data) => {
      toast.success("AI job queued");
    }
  }));

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: async () => {
        toast.success("Workflow queued");
        await queryClient.invalidateQueries(trpc.getWorkflows.pathFilter());
      },
      onError: () => {
        toast.error("Failed to queue workflow");
      },
    })
  );

  const workflows = Array.isArray(workflowsQuery.data) ? workflowsQuery.data : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d7f0ff,transparent_45%),radial-gradient(circle_at_bottom_right,#ffe4c9,transparent_40%),linear-gradient(180deg,#f7fbff_0%,#fffaf2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-xl backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Badge className="bg-black text-white">Authenticated Space</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Workflow Control Center
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-black/65 sm:text-base">
                Manage and queue your automations from one place. Create a new
                workflow job and monitor current entries in real time.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto">
              <Button
                disabled={create.isPending}
                onClick={() => create.mutate()}
                className="h-11 rounded-xl px-5"
              >
                {create.isPending ? "Queuing workflow..." : "Create Workflow"}
              </Button>
              <LogoutButton />
              <Button
                disabled={testAi.isPending}
                onClick={() => testAi.mutate()}
                className="h-11 rounded-xl px-5"
              >
                {testAi.isPending ? "Testing AI..." : "Test AI"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;