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

    static render(element : ISPAElement, container : HTMLElement){
        const dom =
        element.type == "TEXT_ELEMENT"
        ? document.createTextNode(element.props.nodeValue as string)
        : document.createElement(element.type)
          
        if(element.type !== "TEXT_ELEMENT") element.props.children.forEach(child =>
            {
                if(typeof child == "object" && dom instanceof HTMLElement) return this.render(child, dom)
            }
        )

        container.appendChild(dom)
    }
}

console.log(JSON.stringify(SPA.createElement(
    "div", 
    {id : 'test', value : '2'}, 
    {type : 'span', props : {
        children : ["spanValue"]
    }}
)))

document.body.onload = addToRoot;

function addToRoot() {
    const root = document.body.querySelector("#root")
    if(root) SPA.render(SPA.createElement(
        "div", 
        {id : 'test', value : '2'}, 
        {type : 'span', props : {
            children : ["spanValue"]
        }}
    ), root as HTMLElement)
}