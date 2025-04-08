
import {  ExecutionEnvironment } from "@/types/executor";

// import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";

export async function PageToHtmlExecutor(enviornment:ExecutionEnvironment<typeof PageToHtmlTask>):Promise<boolean> {
  try{
    // throw new Error("test");
    const html = await enviornment.getPage()!.content();
    // console.log("PAGE HTML",html)
    enviornment.setOutput("Html",html)
   
   
    return true;
}
catch(error:any){
    enviornment.log.error(error.message)
    return false;
}
}