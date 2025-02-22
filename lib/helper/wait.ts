import { set } from "date-fns";

export function waitFor(ms:number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}