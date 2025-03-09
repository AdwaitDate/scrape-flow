import { TaskParamType, TaskType, TaskDefinition } from "@/types/task";
import { TextIcon, LucideProps } from "lucide-react";

export const ExtractTextTask: TaskDefinition = {
  type: TaskType.EXTRACT_TEXT,
  label: "Extract Text",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "CSS Selector",
      type: TaskParamType.SELECTOR,
      required: true,
      helperText: "e.g. h1.title, .product-price",
    }
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.ARRAY,
    },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 