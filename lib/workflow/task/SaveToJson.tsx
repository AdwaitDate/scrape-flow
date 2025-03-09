import { TaskParamType, TaskType } from "@/types/task";
import { SaveIcon, LucideProps } from "lucide-react";

export const SaveToJsonTask = {
  type: TaskType.SAVE_TO_JSON,
  label: "Save to JSON",
  icon: (props: LucideProps) => (
    <SaveIcon className="stroke-green-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Data",
      type: TaskParamType.ARRAY,
      required: true,
    },
    {
      name: "Filename",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g. data.json",
    }
  ],
  outputs: []
}; 