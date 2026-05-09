import { useSetAtom } from "jotai";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { activeExecutionIdAtom } from "../store/atoms";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();
  const setActiveExecutionId = useSetAtom(activeExecutionIdAtom);

  const handleExecute = async () => {
    try {
      const execution = await executeWorkflow.mutateAsync({ id: workflowId });
      setActiveExecutionId(execution.executionId);
    } catch {
      // The mutation hook already shows the error toast.
    }
  };
  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
    >
      <PlayIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
