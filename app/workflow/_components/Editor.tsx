"use client";
import { Workflow } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import TaskMenu from "./TaskMenu";

function Editor({ workflow }: { workflow: Workflow }) {
  const [definition, setDefinition] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedDefinition = JSON.parse(workflow.definition);
      setDefinition(parsedDefinition);
    } catch (error) {
      console.error("Failed to parse workflow definition:", error);
      setDefinition({ nodes: [], edges: [] });
    }
  }, [workflow.definition]);

  if (!definition) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen">
        <Topbar workflow={workflow} />
        <div className="flex flex-1 overflow-hidden">
          <TaskMenu />
          <div className="flex-1">
            <FlowEditor workflow={workflow} />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;
