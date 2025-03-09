import { TaskParamType, TaskType } from "@/types/task";
import { FilterIcon, LucideProps } from "lucide-react";

export const FilterDataTask = {
  type: TaskType.FILTER_DATA,
  label: "Filter Data",
  icon: (props: LucideProps) => (
    <FilterIcon className="stroke-yellow-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Data",
      type: TaskParamType.ARRAY,
      required: true,
    },
    {
      name: "Filter Condition",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g. item.price > 100",
    }
  ],
  outputs: [
    {
      name: "Filtered Data",
      type: TaskParamType.ARRAY,
    }
  ]
}; 