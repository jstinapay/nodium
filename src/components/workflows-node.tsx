"use client"

import { NodeToolbar, Position } from "@xyflow/react";
import { Settings2Icon, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./ui/button";

interface WorkflowNodeProps {
    children?: ReactNode;
    showToolbar?: boolean;
    onSettings?: () => void;
    onDelete?: () => void;
    name?: string;
    description?: string;

};

export function WorkflowNode({ 
    children,
    showToolbar = true, 
    onSettings, 
    onDelete, 
    name, 
    description 
}: WorkflowNodeProps) {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button size="sm" variant="ghost" onClick={onSettings}>
                        <Settings2Icon className="size-4"/>
                    </Button>                   
                     <Button size="sm" variant="ghost" onClick={onDelete}>
                        <Trash2Icon className="size-4"/>
                    </Button>
                </NodeToolbar>
            )}
            {children}
            {name  && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-50 text-center"
                    >
                        <p className="font-medium">
                            {name}
                        </p>
                        {description && (
                            <p className="text-muted-foreground truncate text-sm">
                                {description}
                            </p>
                        )}
                </NodeToolbar>
            )}
        </>
    )
}
