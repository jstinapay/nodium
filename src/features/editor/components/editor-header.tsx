"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import { 
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";
import { useAtomValue } from "jotai";
import { ModeToggle } from "@/components/theme-toggle";

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const updateWorkflow = useUpdateWorkflowName();

    const [ isEditing, setIsEditing ] = useState(false);
    const [ name, setName ] = useState(workflow.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (name === workflow.name) {
            setIsEditing(false);
            return;
        }

        try {
            await updateWorkflow.mutateAsync({ id: workflowId, name });
            setIsEditing(false);
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setName(workflow.name);
            setIsEditing(false);
        }
    };
    if (isEditing) {
        return (
            <Input
                disabled={updateWorkflow.isPending}
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 w-auto min-w-25 px-2"
            />
        );
    }

    return (
        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {workflow.name}
        </BreadcrumbItem>
    )
}

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href="/workflows">
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
              <BreadcrumbSeparator/>
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        
        </Breadcrumb>
    )
}

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
            const editor = useAtomValue(editorAtom);
            const saveWorkflow = useUpdateWorkflow();

            const handleSave = () => {
                if (!editor) return;

                const nodes = editor.getNodes();
                const edges = editor.getEdges();

                saveWorkflow.mutate({ 
                    id: workflowId, 
                    nodes, 
                    edges 
                });
            }
            return (
            <div className="ml-auto">
                <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
                    <SaveIcon className="size-4"/>
                    Save
                </Button>

            </div>
        )
    }

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Nodium</h1>
            <div className="flex w-full flex-row items-center justify-between gap-x-4 px-4">
                <EditorBreadcrumbs workflowId={workflowId} />
                <div className="flex items-center gap-2">
                    <EditorSaveButton workflowId={workflowId} />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};