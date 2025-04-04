
import {  ExecutionEnvironment } from "@/types/executor";

import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement.tsx";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(enviornment:ExecutionEnvironment<typeof ExtractTextFromElement>):Promise<boolean> {
  try{
    const selector = enviornment.getInput("Selector");
    if(!selector){
      enviornment.log.error("selector not defined")

      return false;
    }
   const html = enviornment.getInput("Html");
   if(!html){
    enviornment.log.error("html not defined")
    return false;
   }
   
   const $ = cheerio.load(html);
   const element = $(selector);

   if(!element){
    enviornment.log.error("element not found")
    return false;
   }

   const extractedText = $.text(element);
   if(!extractedText){
    enviornment.log.error("Element has no text");
    return false
   }

   enviornment.setOutput("Extracted Text",extractedText)

   
    return true;
}
catch(error:any){
  enviornment.log.error(error.message)
    return false;
}
}