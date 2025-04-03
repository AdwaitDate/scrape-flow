import { Browser } from "puppeteer";
import { WorkflowTask } from "./workflow";




export type Enviornment ={
    browser?:Browser;
    //phases with node id as key
    phases:Record<
    string,
    {
        inputs:Record<string,string>;
        outputs:Record<string,string>;
    }
    >
}

export type ExecutionEnvironment <T extends WorkflowTask> ={
    getInput(name:T["inputs"][number]["name"]):string;
}