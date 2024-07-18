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
    ID: String;
    firstname: string;
    lastname: string;
    email: string;
    nameAbbreviation:string;
}

export interface IKPIs {
    ID: string;
    subChapter: string;
    subchapterName: string;
}
