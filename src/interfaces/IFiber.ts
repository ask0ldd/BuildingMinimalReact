export type IFiber = {
    type: string
    props: {
        children: IFiber[]
        [key: string]: unknown | never[] | string
        nodeValue?: string
    }
    child? : IFiber
    parent: IFiber
    dom: HTMLElement | Text | null
    sibling? : IFiber
}