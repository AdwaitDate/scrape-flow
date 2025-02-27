import { waitFor } from '@/lib/helper/wait';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import Editor from '@/app/workflow/_components/Editor';
async function page({params}:{params:{workflowId:string}}) {
    const {workflowId} = params;
    const {userId} = auth();
    if(!userId){
        <div>Unauthenticated;</div>
    }
    
    // await waitFor(1500);
    const workflow = await prisma.workflow.findUnique({
        where:{
            id:workflowId,
            userId: userId ?? undefined,
        }
    })


    if(!workflow){
        return <div>Workflow not found</div>
    }




  return (
    <Editor workflow={workflow}/>
  )
}

export default page
