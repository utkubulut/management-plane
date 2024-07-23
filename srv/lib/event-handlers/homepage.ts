import { EventHandler, TypedRequest, utils } from "@sap/cds";
import { IUserAPI } from "../../types/homepage.types";
import { IKPIs } from "../../types/homepage.types";
import { connect } from "@sap/cds";
const onBeforeCreateReportHistory: EventHandler = async function (req:TypedRequest<{IUserAPI}>):Promise<void>{
let x=5;
}
const onReadKPIs: EventHandler = async function (req:TypedRequest<{IKPIs}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;

}
const onReadSection: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const section = await db.run(req.query);
    return section;

}
const onKPIsViewRead: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;

}
const onKPIStateCountRead: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;

}
const onKPIsReportRead: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;
}
const onKPIDocumentViewRead: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;
}
const onDocumentRead: EventHandler = async function (req:TypedRequest<{IBindingParams}>):Promise<void>{
    const db = await connect.to("db");
    const sectionIDCount = await db.run(req.query);
    return sectionIDCount;
}

export {
    onBeforeCreateReportHistory,
    onReadKPIs,
    onReadSection,
    onKPIsViewRead,
    onKPIStateCountRead,
    onKPIsReportRead,
    onKPIDocumentViewRead,
    onDocumentRead

}