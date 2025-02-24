import { ISPAElement } from "./interfaces/ISPAElement";

class SPA{
    static createElement(type : string, props : object | null = null, ...children : (ISPAElement | string)[]){
        return ({
            type,
            props : {
                ...props,
                children
            }
        })
    }
}

console.log(SPA.createElement("div", {id : 'test', value : '2'}, "hello", "div"))