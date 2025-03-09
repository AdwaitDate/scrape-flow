"use client";

import { Button } from "@/components/ui/button";
import { UpdateWorkFlow } from "@/actions/workflows/updateWorkflow";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { Workflow } from "@prisma/client";

export default function SaveBtn({ workflow }: { workflow: Workflow }) {
  const [isSaving, setIsSaving] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = workflow.id;
    
    try {
      toast.loading("Saving workflow...", { id: toastId });
      
      const nodes = getNodes();
      const edges = getEdges();
      
      await UpdateWorkFlow({
        id: workflow.id,
        definition: JSON.stringify({ nodes, edges }),
      });
      
      toast.success("Workflow saved successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to save workflow:", error);
      toast.error(`Failed to save: ${error instanceof Error ? error.message : String(error)}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={handleSave} 
      disabled={isSaving}
      className="flex items-center gap-2"
    >
      <SaveIcon size={16} />
      {isSaving ? "Saving..." : "Save"}
    </Button>
  );
}
