
import {  ExecutionEnvironment } from "@/types/executor";
// import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAI } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { sysmmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";


export async function ExtractDataWithAIExecutor(enviornment:ExecutionEnvironment<typeof ExtractDataWithAI>):Promise<boolean> {
  try{
   const credentials = enviornment.getInput("Credentials");
   if(!credentials){
    enviornment.log.error("input->credentials not defined")
   }
   const prompt = enviornment.getInput("Prompt");
   if(!prompt){
    enviornment.log.error("input->prompt not defined")
   }
   const content = enviornment.getInput("Content");
   if(!content){
    enviornment.log.error("input->content not defined")
   }
   


   //get credential frokm DB

   const credential = await prisma.credential.findUnique({
    where:{
      id:credentials
    }
   })

   if(!credential){
    enviornment.log.error("credential not found")
    return false;
   }

   const plainCredentialValue = sysmmetricDecrypt(credential.value)
   if(!plainCredentialValue){
    enviornment.log.error("cannot decrypt credential");
   }

   const mockExtractedData ={
    usernameSelector:"#username",
    passwordSelector:"#password",
    loginSelector:"body > div.container > form > input.btn.btn-primary",
   }

  const openai = new OpenAI({
    apiKey:plainCredentialValue,
  })

  const response = await openai.chat.completions.create({
    model:"gpt-4o-mini",
    messages:[
      {
        role:"system",
        content:"You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text"
      },{
        role:"user",
        content:content
      },{
        role:"user", content:prompt
      }
    ],
    temperature:1,
  })
  enviornment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`)
  enviornment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`)

  const result = response.choices[0].message?.content
  if(!result){
    enviornment.log.error("empty response from AI")
    return false
  }



   enviornment.setOutput("Extracted data",result)
  //  enviornment.setOutput("Extracted data",mockExtractedData)
  //  console.log("@PLAIN CREDENTIAL",plainCredentialValue)
   
    return true;
}
catch(error:any){
    enviornment.log.error(error.message)
    return false;
}
}