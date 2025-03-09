import { TaskParamType, TaskType } from "@/types/task";
import { MousePointerClickIcon, LucideProps } from "lucide-react";

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props: LucideProps) => (
    <MousePointerClickIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Element Selector",
      type: TaskParamType.SELECTOR,
      required: true,
      helperText: "e.g. button.submit-btn",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 