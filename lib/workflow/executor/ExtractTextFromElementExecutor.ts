
import {  ExecutionEnvironment } from "@/types/executor";

import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement.tsx";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(enviornment:ExecutionEnvironment<typeof ExtractTextFromElement>):Promise<boolean> {
  try{
    const selector = enviornment.getInput("Selector");
    if(!selector){
      return false;
    }
   const html = enviornment.getInput("Html");
   if(!html){
    return false;
   }
   
   const $ = cheerio.load(html);
   const element = $(selector);

   if(!element){
    console.error("Element not found");
    return false;
   }

   const extractedText = $.text(element);
   if(!extractedText){
    console.error("Element has no text");
    return false
   }

   enviornment.setOutput("Extracted Text",extractedText)

   
    return true;
}
catch(error){
    console.log(error)
    return false;
}
}