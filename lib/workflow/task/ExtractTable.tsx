import { TaskParamType, TaskType } from "@/types/task";
import { TableIcon, LucideProps } from "lucide-react";

export const ExtractTableTask = {
  type: TaskType.EXTRACT_TABLE,
  label: "Extract Table",
  icon: (props: LucideProps) => (
    <TableIcon className="stroke-purple-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Table Selector",
      type: TaskParamType.SELECTOR,
      required: true,
      helperText: "e.g. table.data-table",
    }
  ],
  outputs: [
    {
      name: "Table Data",
      type: TaskParamType.ARRAY,
    },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 