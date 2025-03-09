import { executeWorkflow } from "@/lib/workflow/executeWorkflow";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nodes, edges } = await req.json();
    
    if (!nodes || !edges) {
      return NextResponse.json(
        { error: "Missing required fields: nodes, edges" },
        { status: 400 }
      );
    }

    const results = await executeWorkflow(nodes, edges);
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Workflow execution error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 