import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/wait";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { boolean } from "zod";
import { ExecutorRegistry } from "./executor/registry";
import { Enviornment, ExecutionEnvironment } from "@/types/executor";


export async function ExecuteWorkflow(executionId:string) {
    const execution  = await prisma.workflowExecution.findUnique({
        where:{id:executionId},
        include:{workflow:true,phases:true},
    })
    

    if (!execution){
        throw new Error("execution not found");
    }

    //TODO:setup execution enviornment
    const enviornment:Enviornment ={phases:{}}
   await initializeWorkflowExecution(executionId,execution.workflowId);
   await initializePhaseStatuses(execution)


   let creditsConsumed =0;
    let executionFailed =false;
    for(const phase of execution.phases){
        //TODO:consume credits
        const phaseExecution = await executeWorkflowPhase(phase,enviornment);
        if(!phaseExecution.success){
            executionFailed = true;
            break;
        }
    }
    

    await finalizeWorkflowExecution(executionId,execution.workflowId,executionFailed,creditsConsumed)
    //TODO:cleanup envoirnment

    revalidatePath("/workflows/runs")
}


async function initializeWorkflowExecution(executionId:string,workflowId:string) {
    await prisma.workflowExecution.update({
        where:{id:executionId},
        data:{
            startedAt: new Date(),
            status:WorkflowExecutionStatus.RUNNING,

        }
    })
    
    await prisma.workflow.update({
        where:{
            id:workflowId,
        },
        data:{
            lastRunAt:new Date(),
            lastRunStatus:WorkflowExecutionStatus.RUNNING,
            lastRunId:executionId,
        },
    })
}

async function initializePhaseStatuses(execution:any) {
    await prisma.executionPhase.updateMany({
        where:{
            id:{
                in: execution.phases.map((phases:any)=>phases.id)
            }
        },
        data:{
            status:ExecutionPhaseStatus.PENDING,
        }
    })
}

async function finalizeWorkflowExecution(executionId:string,workflowId:string,executionFailed:boolean,creditsConsumed:number) {
    const finialStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED

    await prisma.workflowExecution.update({
        where:{id:executionId},
        data:{
            status:finialStatus,
            completedAt: new Date(),
            creditsConsumed,
        }
    })

    await prisma.workflow.update({
        where:{
            id: workflowId,
            lastRunId:executionId,
        },
        data:{
            lastRunStatus:finialStatus,
        }
    }).catch (err => {
        //igonore
    })  
}


async function executeWorkflowPhase(phase:ExecutionPhase,enviornment:Enviornment) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;


    setupEnvironmentForPhase(node,enviornment);

    //update phase status
    await prisma.executionPhase.update({
        where:{
            id:phase.id
        },
        data:{
            status:ExecutionPhaseStatus.RUNNING,
            startedAt,
        }
    })


    const creditsRequired = TaskRegistry[node.data.type].credits;
    console.log(`Exexuting phase ${phase.name} with ${creditsRequired} credits required`)

    //TODO: decrementing user balance
    
    //simulation
   const success = await executePhase(phase,node,enviornment)

    await finalizePhase(phase.id,success);
    return{success}
    
}
async function finalizePhase(phaseId:string,success:boolean) {
    const finialStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where:{
            id:phaseId,

        },
        data:{
            status:finialStatus,
            completedAt:new Date(),
        }
    })
    
}

async function executePhase(phase:ExecutionPhase,node:AppNode,enviornment:Enviornment):Promise<boolean>{
    {
        const runFn = ExecutorRegistry[node.data.type];
        if(!runFn){
            return false;
        }

        const executionEnvironment:ExecutionEnvironment<any> = createExecutionEnvironment(node, enviornment)

        return await runFn(executionEnvironment);
    }
    
}

function setupEnvironmentForPhase(node:AppNode,enviornment:Enviornment){
    enviornment.phases[node.id] = {inputs:{},outputs:{}}
    const inputs = TaskRegistry[node.data.type].inputs


    for(const input of inputs){
        const inputValue = node.data.inputs[input.name];
        if(inputValue){
            enviornment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        //Get input values from outputs
    }
}
function createExecutionEnvironment(node:AppNode,enviornment:Enviornment){
    return{
        getInput:(name:string)=> enviornment.phases[node.id]?.inputs[name],

    }
}