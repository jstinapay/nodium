import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center ">
      <Button variant="outline" className={cn("animate-pulse")}>
        Click me
      </Button>
    </div>
  );
};

export default Page;