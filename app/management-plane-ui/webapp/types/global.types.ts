import { UUID } from "crypto";
import Filter from "sap/ui/model/Filter";

export enum ApplicationModels {
    DEFAULT_ODATA = "",
}

export interface IBindingParams {
    filters: Filter[];
    events: { [key: string]: Function };
    arguments: {
        sectionID: string,
        kpiID: string,
        subKPI: string,
        paragraph: string
    };
}
export interface IUserAPI {
    fullName:string;
    firstname:string;
    lastname:string;
    email:string;
    modifiedType:string;
    modifiedContent:string;
    avatar:string;
    iconType:string;
}
export interface IReportHistory {
    fullName:string;
    modifiedType:string;
    modifiedContent:string;
    avatar:string;
    iconType:string;
}

export interface IKPIs {
    ID: string;
    subChapter: string;
    subchapterName: string;
}
