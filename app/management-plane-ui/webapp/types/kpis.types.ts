import { array } from "@sap/cds";
import Filter from "sap/ui/model/Filter";

export interface IBindingParams {
    filters: Filter[];
    events: { [key: string]: Function };
    arguments: {
        sectionID: string,
        kpiID: string,
        subKPI: string,
        paragraph: string,
        reportID:string,
        customerID:string
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
export interface IReportSet {
    reportID:string;
    customerID:string;
    reportTitle:string;
    reportURL: null,
    keywords:string,
    description:string;
    status:string;
    lastModified:string;
    creator:string;
}
export interface IDocuments {
    ID: string;                
    reportID: string;     
    title: string;        
    type: string;         
    lastModified: string; 
}


export interface IKPIs {
    ID: string;
    subChapter: string;
    subchapterName: string;
    documents: {
        results: Array<{
            reportID: string;
        }>;
    };
}
