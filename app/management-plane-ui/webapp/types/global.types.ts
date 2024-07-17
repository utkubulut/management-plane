import Filter from "sap/ui/model/Filter";

export enum ApplicationModels {
    DEFAULT_ODATA = "",
}

export interface IBindingParams {
    filters:Filter[];
    events: { [key: string]: Function };
    arguments:{
        sectionID: string,
        kpiID: string,
        subKPI: string,
        paragraph: string
    };
}
export interface IUserAPI {
    name: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface IKPIs {
    ID:string;
    subChapter:string;
    subchapterName:string;
}
