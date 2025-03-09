import { TaskRegistry } from "./registry";
import { TaskType } from "@/types/task";
import React from "react";

// This component is just for checking if all icons are properly defined
export function IconCheck() {
  return (
    <div>
      {Object.values(TaskRegistry).map((task, index) => (
        <div key={index}>
          {task.icon && <task.icon size={24} />}
          <span>{task.label}</span>
        </div>
      ))}
    </div>
  );
} 