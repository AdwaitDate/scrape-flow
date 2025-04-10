
import {  ExecutionEnvironment } from "@/types/executor";
// import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAI } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { sysmmetricDecrypt } from "@/lib/encryption";


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

   enviornment.setOutput("Extracted data",JSON.stringify(mockExtractedData))
  //  console.log("@PLAIN CREDENTIAL",plainCredentialValue)
   
    return true;
}
catch(error:any){
    enviornment.log.error(error.message)
    return false;
}
}