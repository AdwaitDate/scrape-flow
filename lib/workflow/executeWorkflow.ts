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
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";


export async function ExecuteWorkflow(executionId:string,nextRunAt?:Date) {
    const execution  = await prisma.workflowExecution.findUnique({
        where:{id:executionId},
        include:{workflow:true,phases:true},
    })
    

    if (!execution){
        throw new Error("execution not found");
    }

    const edges = JSON.parse(execution.definition).edges as Edge[]

    //TODO:setup execution enviornment
    const enviornment:Enviornment ={phases:{}}
   await initializeWorkflowExecution(executionId,execution.workflowId,nextRunAt);
   await initializePhaseStatuses(execution)

   
   let creditsConsumed =0;
   let executionFailed =false;
   for(const phase of execution.phases){
        const logCollector =createLogCollector();
       
        const phaseExecution = await executeWorkflowPhase(phase,enviornment,edges,logCollector,execution.userId);
        creditsConsumed += phaseExecution.creditsConsumed;
        if(!phaseExecution.success){
            executionFailed = true;
            break;
        }
    }
    

    await finalizeWorkflowExecution(executionId,execution.workflowId,executionFailed,creditsConsumed)
    await cleanupEnvironment(enviornment)

    revalidatePath("/workflows/runs")
}


async function initializeWorkflowExecution(executionId:string,workflowId:string,nextRunAt?:Date) {
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
            ...(nextRunAt && {nextRunAt})
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


async function executeWorkflowPhase(phase:ExecutionPhase,enviornment:Enviornment,edges:Edge[],logCollector:LogCollector,userId:string) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;


    setupEnvironmentForPhase(node,enviornment,edges);

    //update phase status
    await prisma.executionPhase.update({
        where:{
            id:phase.id
        },
        data:{
            status:ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs:JSON.stringify(enviornment.phases[node.id].inputs)
        }
    })


    const creditsRequired = TaskRegistry[node.data.type].credits;
    // console.log(`Exexuting phase ${phase.name} with ${creditsRequired} credits required`)


// decrementing user balance
    let success = await decrementCredits(userId,creditsRequired,logCollector)
    const creditsConsumed = success ? creditsRequired :0;
    if (success){
        // we can execute the phase if credits are sufficient
       success = await executePhase(phase,node,enviornment,logCollector)
    }

    
    //simulation
    const outputs = enviornment.phases[node.id].outputs;
    await finalizePhase(phase.id,success,outputs,logCollector,creditsConsumed);
    return{success,creditsConsumed}
    
}
async function finalizePhase(phaseId:string,success:boolean,outputs:any,logCollector:LogCollector,creditsConsumed:number) {
    const finialStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where:{
            id:phaseId,

        },
        data:{
            status:finialStatus,
            completedAt:new Date(),
            outputs:JSON.stringify(outputs),
            creditsConsumed,
            logs:{
                createMany:{
                    data:logCollector.getAll().map(log=>({
                        message:log.message,
                        timestamp:log.timestamp,
                        logLevel:log.level,
                    }))
                }
            }
        }
    })
    
}

async function executePhase(phase:ExecutionPhase,node:AppNode,enviornment:Enviornment,logCollector:LogCollector):Promise<boolean>{
    {
        const runFn = ExecutorRegistry[node.data.type];
        if(!runFn){
            return false;
        }

        const executionEnvironment:ExecutionEnvironment<any> = createExecutionEnvironment(node, enviornment,logCollector)

        return await runFn(executionEnvironment);
    }
    
}

function setupEnvironmentForPhase(node:AppNode,enviornment:Enviornment,edges:Edge[]){
    enviornment.phases[node.id] = {inputs:{},outputs:{}}
    const inputs = TaskRegistry[node.data.type].inputs


    for(const input of inputs){
        if(input.type === TaskParamType.BROWSER_INSTANCE) continue;
        const inputValue = node.data.inputs[input.name];
        if(inputValue){
            enviornment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        //Get input values from outputs
        const connectedEdge = edges.find(edge=> edge.target === node.id && edge.targetHandle === input.name)
        if(!connectedEdge) {
            console.error("Missing edge for input",input.name,"node id:",node.id);
            continue};

        const outputValue = enviornment.phases[connectedEdge.source].outputs[
            connectedEdge.sourceHandle!
        ]
        enviornment.phases[node.id].inputs[input.name]=outputValue
    }
}
function createExecutionEnvironment(node:AppNode,enviornment:Enviornment,LogCollector:LogCollector):ExecutionEnvironment<any>{
    return{
        getInput:(name:string)=> enviornment.phases[node.id]?.inputs[name],
        setOutput:(name:string,value:string)=>{
            enviornment.phases[node.id].outputs[name] = value;
        },

        getBrowser:()=> enviornment.browser,
        setBrowser:(browser:Browser) => (enviornment.browser = browser),

        getPage:() => enviornment.page,
        setPage:(page:Page) => (enviornment.page = page),

        log:LogCollector,
    }
}

async function cleanupEnvironment(environment:Enviornment) {
    if(environment.browser){
        await environment.browser
        .close()
        .catch((err)=>console.error("cannot close browser,reason:",err))
    }    
}

async function decrementCredits(userId:string,amount:number,logCollector:LogCollector) {
    try {
        await prisma.userBalance.update({
            where:{userId,credits:{gte:amount}},
            data:{credits:{decrement:amount}}
        })
        return true;
    } catch (error) {
        // console.error(error)
        logCollector.error("insufficient balance")
        return false
    }
    
}