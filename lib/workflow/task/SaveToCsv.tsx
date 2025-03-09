import { TaskParamType, TaskType } from "@/types/task";
import { FileSpreadsheetIcon, LucideProps } from "lucide-react";

export const SaveToCsvTask = {
  type: TaskType.SAVE_TO_CSV,
  label: "Save to CSV",
  icon: (props: LucideProps) => (
    <FileSpreadsheetIcon className="stroke-blue-400" {...props} />
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
      helperText: "e.g. data.csv",
    }
  ],
  outputs: []
}; 