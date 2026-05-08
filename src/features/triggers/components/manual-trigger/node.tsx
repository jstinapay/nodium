import { MousePointer2Icon } from "lucide-react"
import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react"
import { BaseTriggerNode } from "../base-trigger-node"
export const ManualTriggerNode = memo((props: NodeProps) => {
        return (
            <>
                <BaseTriggerNode 
                    {...props}
                    icon={MousePointer2Icon}
                    name="When clicking 'Execute workflow'"
                    // status={nodeStatus}
                    // onSettings={handleOpenSettings}
                    // onDoubleClick={handleOpenSettings}
                />
            </>
        )
})