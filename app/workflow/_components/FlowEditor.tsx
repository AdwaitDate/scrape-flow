"use client";

import { Workflow } from '@prisma/client';
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import React from 'react'
// Inside app/layout.tsx (for Next.js 13+ using App Router) OR pages/_app.tsx (for Pages Router)
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from './nodes/NodeComponent';



const nodeTypes ={
    FlowScrapeNode:NodeComponent
}


function FlowEditor({workflow}:{workflow:Workflow}) {

    const [nodes,setNodes,onNodesChange]= useNodesState([
        CreateFlowNode(TaskType.LAUNCH_BROWSER),
    ]);
    const [edges,setEdges,onEdgesChange]= useEdgesState([]);


  return (
    <main className='h-full w-full'>
        <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}>
            <Controls position='top-left'/>
            <Background variant={BackgroundVariant.Dots} gap={12} size={2}/>

        </ReactFlow>
    </main>
  )
}

export default FlowEditor
