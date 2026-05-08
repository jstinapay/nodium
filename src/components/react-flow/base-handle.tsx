import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "dark:border-secondary dark:bg-secondary h-4 w-4 rounded-full border-2 border-slate-300 bg-slate-100 shadow-sm transition z-20",
        className,
      )}
    >
      {children}
    </Handle>
  );
}
