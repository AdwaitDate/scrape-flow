import { TaskParamType, TaskType } from "@/types/task";
import { ArrowRightCircleIcon, LucideProps } from "lucide-react";

export const PaginationTask = {
  type: TaskType.PAGINATION,
  label: "Pagination",
  icon: (props: LucideProps) => (
    <ArrowRightCircleIcon className="stroke-indigo-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Next Button Selector",
      type: TaskParamType.SELECTOR,
      required: true,
      helperText: "e.g. a.next-page",
    },
    {
      name: "Max Pages",
      type: TaskParamType.NUMBER,
      required: false,
      helperText: "Stop after N pages (optional)",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 