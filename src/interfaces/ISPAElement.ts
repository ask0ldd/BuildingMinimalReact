/*export interface ISPAElement{
    type: string,
    props: { 
        children: (ISPAElement | string)[]
        [key: string]: unknown
    } | {
        type: "TEXT_ELEMENT"
        children: []
        [key: string]: unknown
        nodeValue : string
    }
}*/

export type ISPAElement = {
    type: Exclude<string, "TEXT_ELEMENT">
    props: {
        children: (ISPAElement | ISPATextElement/* | string*/)[]
        [key: string]: unknown | never[] | string
    }
}

export type ISPATextElement = {
    type: "TEXT_ELEMENT"
    props: {
        children: never[];
        [key: string]: unknown | never[] | string
        nodeValue: string
    }
}