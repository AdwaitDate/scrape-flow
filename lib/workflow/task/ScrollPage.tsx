import { TaskParamType, TaskType } from "@/types/task";
import { ScrollTextIcon, LucideProps } from "lucide-react";

export const ScrollPageTask = {
  type: TaskType.SCROLL_PAGE,
  label: "Scroll Page",
  icon: (props: LucideProps) => (
    <ScrollTextIcon className="stroke-green-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Scroll Amount",
      type: TaskParamType.NUMBER,
      required: false,
      helperText: "Pixels to scroll (empty for full page)",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 