import { MousePointer2Icon } from "lucide-react"
import { Node, NodeProps } from "@xyflow/react";
import { memo, useState } from "react"
import { BaseTriggerNode } from "../base-trigger-node"
import { ManualTriggerDialog } from "./dialog";


export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = "initial"; // Replace with actual status logic

    const handleOpenSettings = () => {
        setDialogOpen(true);
    }
        return (
            <>
                <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
                <BaseTriggerNode 
                    {...props}
                    icon={MousePointer2Icon}
                    name="Manual Trigger"
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
                    
                
            </>
        )
})