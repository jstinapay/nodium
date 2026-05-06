import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

export const useUpgradeModal = () => {
    const [open, setOpen] = useState(false);

    const handleError = (error: unknown) => {
        if (error instanceof TRPCClientError && error.data?.code === "FORBIDDEN") {
            setOpen(true);
            return true; // Indicate that the error was handled
        }
        return false; // Indicate that the error was not handled
    };
    
    const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

    return { handleError, modal };
};

