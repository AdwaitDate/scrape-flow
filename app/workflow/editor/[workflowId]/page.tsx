import { waitFor } from '@/lib/helper/wait';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import Editor from '@/app/workflow/_components/Editor';
import { redirect } from 'next/navigation';

async function page({params}:{params:{workflowId:string}}) {
    const {workflowId} = params;
    const {userId} = auth();
    
    if(!userId){
        // Properly return the authentication error or redirect to login
        return redirect('/sign-in');
    }
    
    // await waitFor(1500);
    const workflow = await prisma.workflow.findUnique({
        where:{
            id:workflowId,
            userId: userId,
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
