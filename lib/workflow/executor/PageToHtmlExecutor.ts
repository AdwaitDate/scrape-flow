
import {  ExecutionEnvironment } from "@/types/executor";

import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function PageToHtmlExecutor(enviornment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean> {
  try{
    const websiteUrl = enviornment.getInput("Website Url")
    console.log("@@WEBSITE URL",websiteUrl);
   
   
    return true;
}
catch(error){
    console.log(error)
    return false;
}
}