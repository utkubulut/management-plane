import { EventHandler, TypedRequest, utils } from "@sap/cds";
import { IUserAPI } from "../../types/homepage.types";
import { IKPIs } from "../../types/homepage.types";
const onBeforeCreateReportHistory: EventHandler = async function (req:TypedRequest<{IUserAPI}>):Promise<void>{
let x=5;
}
const onReadKPIs: EventHandler = async function (req:TypedRequest<{IKPIs}>):Promise<void>{
    let x=5;
}

export {
    onBeforeCreateReportHistory,
    onReadKPIs
}