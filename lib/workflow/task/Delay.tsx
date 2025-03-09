import { TaskParamType, TaskType } from "@/types/task";
import { ClockIcon, LucideProps } from "lucide-react";

export const DelayTask = {
  type: TaskType.DELAY,
  label: "Delay",
  icon: (props: LucideProps) => (
    <ClockIcon className="stroke-gray-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Duration (ms)",
      type: TaskParamType.NUMBER,
      required: true,
      helperText: "Delay in milliseconds",
    }
  ],
  outputs: []
}; 