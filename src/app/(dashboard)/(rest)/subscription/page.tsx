"use client"
import { useTRPC } from "@/trpc/client" 
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

const Page = () => {
    const trpc = useTRPC();
    const testAi = useMutation(trpc.testAi.mutationOptions({
        onSuccess: () => { toast.success("success!"); },
        onError: ({ message }) => { toast.error(message || "An error occurred"); },
    }));

    return (
    <Button onClick={() => testAi.mutate()}>
        Click to test subscription
    </Button>
)
};

export default Page;

