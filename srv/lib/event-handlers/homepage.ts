import { EventHandler, TypedRequest, utils } from "@sap/cds";

import { connect } from "@sap/cds";
const onBeforeCreateReportHistory: EventHandler = async function (req:TypedRequest<{
    modifiedType: string;
    modifiedContent: string;
    avatar: string;
    iconType: string;
    fullName: string;
}>):Promise<void>{
    const db = await connect.to("db");
    const newReportHistory = {
        ID: utils.uuid(),
        fullName: req.data.fullName,
        modifiedType: req.data.modifiedType,
        reportDate: new Date(),
        modifiedContent: req.data.modifiedContent,
        avatar: req.data.avatar,
        iconType: req.data.iconType
    };
    await db.run(INSERT.into('ReportHistory').entries(newReportHistory));
}


export {
    onBeforeCreateReportHistory
}