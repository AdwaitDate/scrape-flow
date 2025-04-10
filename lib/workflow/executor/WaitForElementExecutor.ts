
import {  ExecutionEnvironment } from "@/types/executor";
// import { ClickElementTask } from "../task/ClickElement";
import { WaitForElementTask } from "../task/WaitForElement";


export async function WaitForElementExecutor(enviornment:ExecutionEnvironment<typeof WaitForElementTask>):Promise<boolean> {
  try{
   const selector = enviornment.getInput("Selector");
   if(!selector){
    enviornment.log.error("input->selector not defined")
   }
   const visibility = enviornment.getInput("Visibility");
   if(!visibility){
    enviornment.log.error("input->Visibility not defined")
   }
   


   await enviornment.getPage()!.waitForSelector(selector,{
    visible: visibility === "visible",
    hidden:visibility ==="hidden",
    timeout:60000,
   })
   enviornment.log.info(`Element ${selector} became ${visibility}`)
  //  await waitFor(3000)
   
   
    return true;
}
catch(error:any){
    enviornment.log.error(error.message)
    return false;
}
}