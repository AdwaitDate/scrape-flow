import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { error } from "console";
import App from "next/app";

type FlowToExecutionPlanType = { executionPlan?: WorkflowExecutionPlan };

export function FlowToExecutionPlan(
    nodes: AppNode[],
    edges: Edge[]
): FlowToExecutionPlanType {

    const entryPoint = nodes.find(node => TaskRegistry[node.data.type]?.isEntryPoint);
   
    if (!entryPoint) {
        throw new Error("Entry point task not found in the workflow.");
    }

    const planned = new Set<string>();
    const executionPlan:WorkflowExecutionPlan=[
        {
            phase:1,
            nodes:[entryPoint],
        }
    ]


    for (let phase = 2;
        phase<=nodes.length || planned.size< nodes.length ;
        phase++
    ){
        const nextPhase : WorkflowExecutionPlanPhase = {phase,nodes:[]}
        for (const currentNode of nodes){
            if(planned.has(currentNode.id)){
                continue;
            }

            const invalidInputs = getInvalidInputs(currentNode,edges,planned);
            if(invalidInputs.length > 0){
                const incomers = getIncomers(currentNode, nodes,edges);
                if(incomers.every(incomer => planned.has(incomer.id))){
                    //if all incomers are planned are still invalid inputs 
                    //this means that particular node has invalid input
                    console.error("invalid inputs",currentNode.id,invalidInputs);
                    throw new Error("TODO:HANDLE ERROR 1");
                }
                else{
                    //skip for now
                    continue;
                }
            }


            nextPhase.nodes.push(currentNode);
            planned.add(currentNode.id);
        }
    }

    return { executionPlan };
}


function getInvalidInputs(node:AppNode,edges:Edge[],planned:Set<string>){
    const invalidInputs=[];
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs){
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;
        if(inputValueProvided){
            //this input value is fine so we can move on
            continue;
        }
        //if value is not porvided by user then we need to check if there is an output linked to current input
        const incomingEdges =edges.filter((edge)  =>edge.target === node.id);
        const inputLinkedToOutput = incomingEdges.find((edge)=>edge.targetHandle === input.name)

        const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput?.source)

        if(requiredInputProvidedByVisitedOutput){
            continue;
        }
        else if(!input.required){
            if(!inputLinkedToOutput) continue;
            if(inputLinkedToOutput && planned.has(inputLinkedToOutput.source)){
                continue;
            }
        }

        invalidInputs.push(input.name);
    }
    return invalidInputs;
}