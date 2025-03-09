import { TaskParamType, TaskType } from "@/types/task";
import { CameraIcon, LucideProps } from "lucide-react";

export const ScreenshotTask = {
  type: TaskType.SCREENSHOT,
  label: "Take Screenshot",
  icon: (props: LucideProps) => (
    <CameraIcon className="stroke-violet-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Filename",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g. screenshot.png",
    },
    {
      name: "Full Page",
      type: TaskParamType.BOOLEAN,
      required: false,
      helperText: "Capture full page height",
    }
  ],
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ],
}; 