import { waitFor } from "@/lib/helper/wait";
import { Enviornment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(enviornment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean> {
  try{
    const websiteUrl = enviornment.getInput("Website Url")
    console.log("@@WEBSITE URL",websiteUrl);
    const browser = await puppeteer.launch({
        headless: false // for testing
    })
    await waitFor(3000);
    await browser.close();
    return true;
}
catch(error){
    console.log(error)
    return false;
}
}