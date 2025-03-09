import { TaskParamType, TaskType } from "@/types/task";
import { KeyboardIcon, LucideProps } from "lucide-react";

export const FormInputTask = {
  type: TaskType.FORM_INPUT,
  label: "Form Input",
  icon: (props: LucideProps) => (
    <KeyboardIcon className="stroke-cyan-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Input Selector",
      type: TaskParamType.SELECTOR,
      required: true,
      helperText: "e.g. input#username, textarea.message",
    },
    {
      name: "Text Value",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Text to enter in the field",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ]
}; 