"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView, EntitySkeleton } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import { router } from "better-auth/api";
import { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { search, setSearch } = useEntitySearch({
        params,
        setParams,
        debounceMs: 500,
    })

    return (
            <EntitySearch 
                value={search}
                onChange={setSearch}
                placeholder="Search workflows"
            />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
 
    return (
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}  
        />
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal} = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            }
        });
    };

    return (
        <>
            {modal}
            <EntityHeader 
                title="Workflows"
                description="Manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            page={workflows.data?.page ?? 1}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({ ...params, page })}
            itemCount={workflows.data.items.length}
            totalItems={workflows.data.totalCount}
        />
    )
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    )

}

export const WorkflowsLoading = () => {
    return <EntitySkeleton/>
}

export const WorkflowsError = () => {
    return <ErrorView message="Failed to load workflows." />
}

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal} = useUpgradeModal();

    const handleCreate = () => {
    createWorkflow.mutate(undefined, {
        onError: (error) => {
            handleError(error);
        },
        onSuccess: (data) => {
            router.push(`/workflows/${data.id}`);
        }
    });
}
    
    return (
        <>
            {modal}
            <EmptyView
            onNew={handleCreate}
            message="No workflows found"/>
        </>
    )
}

export const WorkflowItem = ({
    data,
}: { 
    data: Workflow }) => {
        const { mutateAsync: removeWorkflow, isPending } = useRemoveWorkflow();

        const handleRemove = async () => {
            await removeWorkflow({ id: data.id });
        }

        return (
            <EntityItem
                href={`/workflows/${data.id}`}
                title={data.name}
                subtitle={
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Updated {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>Created {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}</span>
                    </div>
                }
                image={
                    <div className="size-8 flex items-center justify-center rounded-md bg-primary/10"> 
                        <WorkflowIcon className="size-5 text-primary"/>
                    </div>
                }
                onRemove={handleRemove}
                isRemoving={isPending}
            />
        )
}



