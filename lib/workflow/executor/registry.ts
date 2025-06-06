import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
// import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
// import { ExtractDataWithAI } from "../task/ExtractDataWithAI";
import { ExtractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";


type ExecutorFn<T extends WorkflowTask> =(environment:ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType={
    [K in TaskType]:ExecutorFn<WorkflowTask & {type:K}>;
}

export const ExecutorRegistry : RegistryType={
    LAUNCH_BROWSER:LaunchBrowserExecutor,
    PAGE_TO_HTML:PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT:ExtractTextFromElementExecutor,
    FILL_INPUT:FillInputExecutor,
    CLICK_ELEMENT:ClickElementExecutor,
    WAIT_FOR_ELEMENT:WaitForElementExecutor,
    DELIVER_VIA_WEBHOOK:DeliverViaWebhookExecutor,
    EXTRACT_DATA_WITH_AI:ExtractDataWithAIExecutor,
}