"use client";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";

interface NodeInputsProps {
  node: {
    id: string;
    data: any;
  };
}

function NodeInputs({ node }: NodeInputsProps) {
  const { setNodes } = useReactFlow();
  const taskType = node.data.type;
  const taskDef = TaskRegistry[taskType];
  
  if (!taskDef) {
    return <div>Unknown task type</div>;
  }

  const handleInputChange = (inputName: string, value: any) => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              inputs: {
                ...n.data.inputs,
                [inputName]: value,
              },
            },
          };
        }
        return n;
      })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {taskDef.inputs.map((input) => (
        <div key={input.name} className="flex flex-col gap-1">
          <Label className="text-xs">{input.name}</Label>
          <Input
            placeholder={input.helperText || ""}
            value={node.data.inputs?.[input.name] || ""}
            onChange={(e) => handleInputChange(input.name, e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

export default NodeInputs;
