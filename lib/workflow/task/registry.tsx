import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { ExtractTextTask } from "./ExtractText";
import { ExtractTableTask } from "./ExtractTable";
import { ClickElementTask } from "./ClickElement";
import { FormInputTask } from "./FormInput";
import { ScrollPageTask } from "./ScrollPage";
import { PaginationTask } from "./Pagination";
import { ScreenshotTask } from "./Screenshot";
import { FilterDataTask } from "./FilterData";
import { DelayTask } from "./Delay";
import { SaveToJsonTask } from "./SaveToJson";
import { SaveToCsvTask } from "./SaveToCsv";

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT: ExtractTextTask,
  EXTRACT_TABLE: ExtractTableTask,
  CLICK_ELEMENT: ClickElementTask,
  FORM_INPUT: FormInputTask,
  SCROLL_PAGE: ScrollPageTask,
  PAGINATION: PaginationTask,
  SCREENSHOT: ScreenshotTask,
  FILTER_DATA: FilterDataTask,
  DELAY: DelayTask,
  SAVE_TO_JSON: SaveToJsonTask,
  SAVE_TO_CSV: SaveToCsvTask,
};
