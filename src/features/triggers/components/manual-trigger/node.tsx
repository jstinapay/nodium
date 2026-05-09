import type { NodeProps } from "@xyflow/react";
import { MousePointer2Icon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/editor/hooks/use-node-status";
import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus(props.id);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="Manual Trigger"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
