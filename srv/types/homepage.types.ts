
export interface IUserAPI {
    fullName:string;
    firstname:string;
    lastname:string;
    email:string;
    modifiedType:string;
    modifiedContent:string;
    avatar:string;
    iconType:string;
};
export interface IKPIs {
    ID: string;
    subChapter: string;
    subchapterName: string;
};
export interface IBindingParams {
    events: { [key: string]: Function };
    arguments: {
        sectionID: string,
        kpiID: string,
        subKPI: string,
        paragraph: string
    };
};