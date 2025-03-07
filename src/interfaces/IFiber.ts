import { ISPAElement, ISPATextElement } from "./ISPAElement"

type Optional<T> = {
    [K in keyof T]?: T[K]
}

export interface IFiber extends ISPAElement {
    // group ISPAElement & ISPATextElement types 
    // with the ISPATextElement nodeValue prop being set to optional
    props: ISPAElement['props'] & Optional<Omit<ISPATextElement['props'], keyof ISPAElement['props']>>
    child?: IFiber
    parent: IFiber
    dom: HTMLElement | Text | null
    sibling?: IFiber
}