"use client";

import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
// Inside app/layout.tsx (for Next.js 13+ using App Router) OR pages/_app.tsx (for Pages Router)
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";
import DeleteableEdge from "./edges/DeletableEdge";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeleteableEdge,
};

const snapGrid: [number, number] = [20, 20];
const fitViewOptions = { padding: 0.2 };

interface FlowEditorProps {
  workflow: Workflow;
}

function FlowEditor({ workflow }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [definition, setDefinition] = useState<any>(null);

  useEffect(() => {
    try {
      const parsedDefinition = JSON.parse(workflow.definition);
      setDefinition(parsedDefinition);
      setNodes(parsedDefinition.nodes || []);
      setEdges(parsedDefinition.edges || []);
    } catch (error) {
      console.error("Failed to parse workflow definition:", error);
      setDefinition({ nodes: [], edges: [] });
      setNodes([]);
      setEdges([]);
    }
  }, [workflow.definition, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const tasktype = event.dataTransfer.getData("application/reactflow");
    if (typeof tasktype === undefined || !tasktype) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = CreateFlowNode(tasktype as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowEditor;
