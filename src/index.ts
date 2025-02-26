import { ISPAElement, ISPATextElement } from "./interfaces/ISPAElement";

class SPA{
    
    static createElement(type : string, props : object | null = null, ...children : (ISPAElement | ISPATextElement | string | number)[]) : ISPAElement{
        const elt = ({
            type,
            props : {
                ...props,
                children: children.map(child => {
                    return typeof child === "object"
                      ? this.createElement(child.type, child.props, ...child.props.children)
                      : this.createTextElement(child.toString())
                    }
                ),
            }
        })
        return elt
    }

    static createTextElement(text : string) : ISPATextElement {
        const elt = ({
          type: "TEXT_ELEMENT" as "TEXT_ELEMENT",
          props: {
            nodeValue: text,
            children: [],
          },
        })
        return elt
    }

    static render(element : ISPAElement | ISPATextElement, container : HTMLElement){
        const dom =
        element.type == "TEXT_ELEMENT"
        ? document.createTextNode((element as ISPATextElement).props.nodeValue)
        : document.createElement(element.type)

        if(dom instanceof HTMLElement) Object.keys(element.props)
            .filter(key => key !== "children")
            .forEach(name => {
            (dom as HTMLElement).setAttribute(name, JSON.stringify(element.props[name]));
            // dom[name] = element.props[name]
            /*dom = Object.assign(dom, {
                ...dom,
                ...element.props
            });*/
        })
          
        if(dom instanceof HTMLElement) element.props.children.forEach(child =>
            {
                if(typeof child == "object" && dom instanceof HTMLElement) return this.render(child, dom)
            }
        )

        container.appendChild(dom)
    }
}

document.body.onload = addToRoot;

function addToRoot() {
    const root = document.body.querySelector("#root")
    if(root) SPA.render(SPA.createElement(
        "div", 
        {id : 'test', value : '2'}, 
        SPA.createElement(
            "div",
            null,
            'hello',
            SPA.createElement(
                "span",
                null,
                "spanValue",
            )
        )
    ), root as HTMLElement)
}