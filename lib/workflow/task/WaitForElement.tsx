import { TaskParamType, TaskType } from "@/types/task";
import { TimerIcon, LucideProps } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait For Element",
  icon: (props: LucideProps) => (
    <TimerIcon className="stroke-yellow-400" {...props} />
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
      helperText: "e.g. #content-loaded",
    },
    {
      name: "Timeout (ms)",
      type: TaskParamType.NUMBER,
      required: false,
      helperText: "Default: 30000",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 