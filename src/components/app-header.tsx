import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";

export const AppHeader = () => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Nodium</h1>
            <div className="flex w-full flex-row items-center justify-between gap-x-4 px-4">
            <div className="ml-auto">
            <ModeToggle />
            </div>
            </div>
        </header>
    );
};