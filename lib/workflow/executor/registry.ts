import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";

export const ExecutorRegistry ={
    LAUNCH_BROWSER:LaunchBrowserExecutor,
    PAGE_TO_HTML:PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT:()=>Promise.resolve(true),
}