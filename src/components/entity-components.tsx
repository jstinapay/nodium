import { AlertTriangleIcon, Loader2Icon, Zap, PlusIcon, SearchIcon, Trash2Icon, MoreVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from './ui/empty'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { Dropdown } from "react-day-picker";
import { PAGINATION } from "@/config/constants";

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
    | {
        onNew: () => void; newButtonHref?: never; }
    | { newButtonHref: string; onNew?: never; }
    | { onNew?: never; newButtonHref?: never; }
)

export const EntityHeader = ({
    title,
    description,
    newButtonLabel,
    disabled,
    isCreating,
    onNew,
    newButtonHref
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {onNew && !newButtonHref && (
                <Button disabled={disabled || isCreating} size="sm" onClick={onNew}>
                    <PlusIcon className="mr-2" size={16} />
                    {newButtonLabel}
                </Button>
            )}
                {newButtonHref && !onNew && (
                <Button  size="sm" asChild>
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="mr-2" size={16} />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
};

type EntityContainerProps = {
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
}; 

export const EntityContainer = ({ header, search, pagination, children }: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-7x1 w-full flex flex-col gap-y-8 h-full">
                {header}
            
            <div className="flex flex-col gap-y-4 h-full">
                {search}
                {children}
            </div>
                {pagination}           
        </div>
        </div>
    )
}

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const EntitySearch = ({ value, onChange, placeholder = "Search" }: EntitySearchProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' && value) {
            onChange('');
            e.currentTarget.blur();
        }
    };

    return (
        <div className="relative ml-auto w-full max-w-xs group">
            <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-background shadow-none border border-input pl-9 pr-8 rounded-md transition-colors focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-0"
                aria-label={placeholder}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground active:text-foreground transition-colors p-0.5 hover:bg-muted rounded"
                    aria-label="Clear search"
                    type="button"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

interface EntityPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    itemCount?: number;
    totalItems?: number;
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled,
    itemCount = 0,
    totalItems = 0
}: EntityPaginationProps) => {
    const startItem = Math.max(1, (page - 1) * itemCount + 1);
    const endItem = Math.min(totalItems, page * itemCount);

    return (
        <div className="flex items-center justify-between gap-x-4 py-4 border-t mt-auto text-sm">
            <div className="text-muted-foreground">
                {totalItems > 0 ? (
                    <>
                        Showing <span className="font-semibold text-foreground">{startItem}</span> to <span className="font-semibold text-foreground">{endItem}</span> of <span className="font-semibold text-foreground">{totalItems}</span> items
                    </>
                ) : (
                    <>
                        Page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages || 1}</span>
                    </>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2">
                <Button 
                    disabled={page === 1 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    aria-label="Previous page"
                >
                    Previous
                </Button>
                <Button
                    disabled={page === totalPages || totalPages === 0 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    aria-label="Next page"
                >
                    Next
                </Button>
            </div>
        </div>
    )
};

interface StateViewProps {
    message?: string
}

export const LoadingView = ({
    message,
}: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="size-8 animate-spin text-primary" />
            {!!message && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    )
}

interface EntitySkeletonProps {
    count?: number;
}

export const EntitySkeleton = ({ count = PAGINATION.DEFAULT_PAGE_SIZE }: EntitySkeletonProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="p-4 shadow-none border border-border">
                    <CardContent className="flex flex-row items-center justify-between p-0 gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="size-8 rounded-md bg-muted animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2 min-w-0">
                                <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                                <div className="h-5 bg-muted rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-8 w-8 rounded bg-muted animate-pulse shrink-0" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export const ErrorView = ({
    message,
}: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="size-8 text-destructive" />
            {!!message && (
                <p className="text-sm text-destructive/80 text-center max-w-sm">
                    {message}
                </p>
            )}
        </div>
    )
}

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void;
};

export const EmptyView = ({ 
    message,
    onNew
}: EmptyViewProps) => {
    return (
        <Empty className="border border-dashed bg-linear-to-br from-muted/50 to-muted/20">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Zap className="text-primary"/>
                </EmptyMedia>
            </EmptyHeader>
         <EmptyTitle>
            Get started
         </EmptyTitle>
         {!!message && (
            <EmptyDescription>
                {message}
            </EmptyDescription>
        )}
        {onNew && (
            <Button onClick={onNew} size="sm" className="gap-2">
                <PlusIcon className="size-4" />
                Create new
            </Button>
        )}
        </Empty>
    )
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string;

}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}: EntityListProps<T>) {
    if (items.length === 0) {
        return (
        <div className="flex-1 flex justify-center items-center">
            <div className="max-w-sm mx-auto">
            {emptyView}
            </div>
        </div> 
        );
    }
    return (
        <div className={cn(
            "flex flex-col gap-y-4 animate-in fade-in-50 duration-300",
            className
        )}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index} className="group">
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
}

interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    isRemoving?: boolean;
    onRemove?: () => void | Promise<void>;
    className?: string;

}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    isRemoving,
    onRemove,
    className
}: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isRemoving || !onRemove) return;
        await onRemove();
    }
    return (
        <Link href={href} prefetch>
            <Card className={cn(
                "p-4 shadow-none hover:shadow-md cursor-pointer transition-all duration-200 border border-border hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                isRemoving && "opacity-50 cursor-not-allowed pointer-events-none",
                className
            )}>
                <CardContent className="flex flex-row items-center justify-between p-0 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {image && <div className="shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">{image}</div>}
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-base font-semibold line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                                {title}
                            </CardTitle>
                            {!!subtitle && (
                                <CardDescription className="text-sm line-clamp-1 mt-1 group-hover:text-muted-foreground transition-colors">
                                    {subtitle}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()} aria-label="Actions">
                                            <MoreVerticalIcon className="size-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem onClick={handleRemove} disabled={isRemoving} className="text-destructive focus:text-destructive cursor-pointer">
                                            <Trash2Icon className="size-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>

            </Card>
        </Link>
    )
}
