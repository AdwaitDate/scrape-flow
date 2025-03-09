"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const { addNodes } = useReactFlow();
  const task = TaskRegistry[taskType];

  const handleAddNode = () => {
    const { x, y } = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const newNode = CreateFlowNode(taskType, { x, y });
    addNodes(newNode);
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2 w-full"
      onClick={handleAddNode}
    >
      <task.icon size={16} />
      <span>{task.label}</span>
    </Button>
  );
}

export default function TaskMenu() {
  return (
    <aside className="w-[340px] min-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction", "interaction", "navigation", "processing", "output"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TABLE} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interaction">
          <AccordionTrigger className="font-bold">
            Page interaction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.FORM_INPUT} />
            <TaskMenuBtn taskType={TaskType.SCROLL_PAGE} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="navigation">
          <AccordionTrigger className="font-bold">
            Navigation
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.LAUNCH_BROWSER} />
            <TaskMenuBtn taskType={TaskType.PAGINATION} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="processing">
          <AccordionTrigger className="font-bold">
            Data processing
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.FILTER_DATA} />
            <TaskMenuBtn taskType={TaskType.DELAY} />
            <TaskMenuBtn taskType={TaskType.SCREENSHOT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="output">
          <AccordionTrigger className="font-bold">
            Output
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.SAVE_TO_JSON} />
            <TaskMenuBtn taskType={TaskType.SAVE_TO_CSV} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
