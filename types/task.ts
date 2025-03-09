export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT = "EXTRACT_TEXT",
    EXTRACT_TABLE = "EXTRACT_TABLE",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    FORM_INPUT = "FORM_INPUT",
    SCROLL_PAGE = "SCROLL_PAGE",
    PAGINATION = "PAGINATION",
    SCREENSHOT = "SCREENSHOT",
    FILTER_DATA = "FILTER_DATA",
    DELAY = "DELAY",
    SAVE_TO_JSON = "SAVE_TO_JSON",
    SAVE_TO_CSV = "SAVE_TO_CSV"
}

export enum TaskParamType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECTOR = "SELECTOR"
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    required?: boolean;
    helperText?: string;
    hideHandle?: boolean;
}

export interface TaskDefinition {
    type: TaskType;
    label: string;
    icon: (props: any) => JSX.Element;
    isEntryPoint: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
}