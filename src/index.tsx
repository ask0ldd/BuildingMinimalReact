import React from "react";
import { ISPAElement, ISPATextElement } from "./interfaces/ISPAElement";
import { IFiber } from "./interfaces/IFiber";

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
          
        if(dom instanceof HTMLElement) {

            Object.keys(element.props)
            .filter(key => key !== "children")
            .forEach(name => {
                dom.setAttribute(name, JSON.stringify(element.props[name]));
            })

            element.props.children.forEach(child =>
                {
                    if(typeof child == "object") return this.render(child, dom)
                }
            )
        }

        container.appendChild(dom)
    }

    /*
        add the element to the DOM
        create the fibers for the element’s children
        select the next unit of work
    */
    static fractionedRender(element: IFiber, container : HTMLElement){
        this.nextUnitOfWork = {
            type : element.type,
            dom: container,
            props: {
              children: [element],
            },
            parent : element.parent,
            sibling : element.sibling
        }
    }

    static createDom(fiber : IFiber) {
        const dom =
          fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)

        if(dom instanceof HTMLElement) {
            Object.keys(fiber.props)
            .filter(key => key !== "children")
            .forEach(name => {
                dom.setAttribute(name, JSON.stringify(fiber.props[name]))
            })
        }
      
        return dom
    }

    static nextUnitOfWork : undefined | IFiber = undefined

    static workLoop(deadline : IdleDeadline) {
        let shouldYield = false
        while (this.nextUnitOfWork && !shouldYield) {
          this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork)
          // keep working if deadline is not close yet
          shouldYield = deadline.timeRemaining() < 1
        }
        // the browser will run the callback
        // when the main thread is idle
        requestIdleCallback(this.workLoop)
    }

    // a fiber has a link to his parent
    // a parent has a link to his first child
    // a child has a link to his next sibling
    static performUnitOfWork(fiber : IFiber) {
        // create the new dom if needed
        if (!fiber.dom) fiber.dom = this.createDom(fiber)

        // append to the current fiber dom to its parent dom
        if (fiber.parent && fiber.parent.dom) fiber.parent.dom.appendChild(fiber.dom)

        const elements = fiber.props.children
        let index = 0
        let prevSibling = null

        while (index < elements.length) {
            const element = elements[index]

            const newFiber : IFiber = {
                type: element.type,
                props: element.props,
                parent: fiber,
                dom: null,
            }

            // if first child, set as the current fiber main child
            if (index === 0) {
                fiber.child = newFiber
            // if not the first one, set as sibling of the previous fiber child
            } else {
                if(prevSibling) prevSibling.sibling = newFiber
            }
    
            prevSibling = newFiber
            index++
        }

        if (fiber.child) {
            return fiber.child
        }
        let nextFiber = fiber
        while (nextFiber) {
            if (nextFiber.sibling) {
                return nextFiber.sibling
            }
            nextFiber = nextFiber.parent
        }
    }
}



document.body.onload = addToRoot;

function addToRoot() {
    const root = document.body.querySelector("#root")
    /** @jsx SPA.createElement */
    const element = (
        // @ts-expect-error
        <div id="test" value="2">
            <div>
                hello
                <span>spanValue</span>
            </div>
        </div>
    )
    SPA.render(element, root as HTMLElement)
}


/*if(root) SPA.render(SPA.createElement(
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
), root as HTMLElement)*/