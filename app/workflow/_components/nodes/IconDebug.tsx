"use client";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import React from "react";

export default function IconDebug() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task Icon Debug</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(TaskRegistry).map(([key, task]) => (
          <div key={key} className="border p-3 rounded">
            <div className="flex items-center gap-2">
              {task.icon ? (
                <task.icon size={24} />
              ) : (
                <span className="text-red-500">Missing icon</span>
              )}
              <span>{task.label}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 