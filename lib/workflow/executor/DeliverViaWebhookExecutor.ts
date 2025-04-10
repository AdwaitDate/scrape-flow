
import {  ExecutionEnvironment } from "@/types/executor";
// import { ClickElementTask } from "../task/ClickElement";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";


export async function DeliverViaWebhookExecutor(enviornment:ExecutionEnvironment<typeof DeliverViaWebhookTask>):Promise<boolean> {
  try{
   const targetUrl = enviornment.getInput("Target URL");
   if(!targetUrl){
    enviornment.log.error("input->selector not defined")
   }

   const body = enviornment.getInput("Body");
   if(!body){
    enviornment.log.error("input->selector not defined")
   }
   


   const respone = await fetch(targetUrl,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(body),
   });

   const statusCode = respone.status;
   if (statusCode !== 200){
    enviornment.log.error(`status code:${statusCode}`)
    return false;
   }
  
   const responseBody = await respone.json();
   enviornment.log.info(JSON.stringify(responseBody,null,4))
   
   
    return true;
}
catch(error:any){
    enviornment.log.error(error.message)
    return false;
}
}