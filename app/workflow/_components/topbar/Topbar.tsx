"use client";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveBtn from "./SaveBtn";
import RunBtn from "./RunBtn";
import { Workflow } from "@prisma/client";

interface Props {
  workflow: Workflow;
}

function Topbar({ workflow }: Props) {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1 items-center">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
        </TooltipWrapper>
        <div className="truncate">
          <p className="font-bold truncate">{workflow.name}</p>
          {workflow.description && (
            <p className="text-xs text-muted-foreground truncate">{workflow.description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <RunBtn />
        <SaveBtn workflow={workflow} />
      </div>
    </header>
  );
}

export default Topbar;
