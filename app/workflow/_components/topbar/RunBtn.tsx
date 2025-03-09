"use client";

import { Button } from "@/components/ui/button";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RunBtn() {
  const [isRunning, setIsRunning] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const handleRun = async () => {
    setIsRunning(true);
    toast.info("Starting workflow execution...");

    try {
      const nodes = getNodes() as AppNode[];
      const edges = getEdges();
      
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute workflow');
      }
      
      toast.success("Workflow executed successfully!");
      console.log("Workflow results:", data.results);
    } catch (error) {
      console.error("Workflow execution failed:", error);
      toast.error(`Execution failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Button 
      onClick={handleRun} 
      disabled={isRunning}
      className="flex items-center gap-2"
    >
      <PlayIcon size={16} />
      {isRunning ? "Running..." : "Run workflow"}
    </Button>
  );
} 