import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
    return (
        <header className="flex h-14 shrink-0 gap-2 px-4 border-b items-center bg-background">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Nodium</h1>
        </header>
    );
};