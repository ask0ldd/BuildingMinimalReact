import { ISPAElement } from "./interfaces/ISPAElement";

class SPA{
    static createElement(type : string, props : object | null = null, ...children : (ISPAElement | string | number)[]) : ISPAElement{
        return ({
            type,
            props : {
                ...props,
                children: children.map(child =>
                    typeof child === "object"
                      ? this.createElement(child.type, null, ...child.props.children)
                      : this.createTextElement(child.toString())
                ),
            }
        })
    }

    static createTextElement(text : string) : ISPAElement {
        return ({
          type: "TEXT_ELEMENT",
          props: {
            nodeValue: text,
            children: [],
          },
        })
    }
