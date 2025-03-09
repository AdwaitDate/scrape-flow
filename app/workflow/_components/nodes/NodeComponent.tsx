"use client";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import NodeHeader from "./NodeHeader";
import NodeInputs from "./NodeInputs";

function NodeComponent({ data, id }: AppNode) {
  const taskType = data.type;
  const taskDef = TaskRegistry[taskType];

  if (!taskDef) {
    return <div>Unknown task type: {taskType}</div>;
  }

  return (
    <div className="bg-card border-2 border-separate rounded-md min-w-[300px] max-w-[300px] shadow-md">
      <NodeHeader taskType={taskType} />
      <div className="p-4">
        <NodeInputs node={{ id, data }} />
      </div>
      
      {/* Input handles */}
      {taskDef.inputs.map((input, index) => (
        !input.hideHandle && (
          <Handle
            key={`input-${index}`}
            type="target"
            position={Position.Left}
            id={input.name}
            style={{ top: 60 + index * 30 }}
            className="w-3 h-3 bg-blue-500"
          />
        )
      ))}
      
      {/* Output handles */}
      {taskDef.outputs.map((output, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={output.name}
          style={{ top: 60 + index * 30 }}
          className="w-3 h-3 bg-green-500"
        />
      ))}
    </div>
  );
}

export default NodeComponent;
