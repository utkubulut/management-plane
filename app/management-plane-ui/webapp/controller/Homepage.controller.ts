
import BaseController from "./BaseController";
import formatter from '../model/formatter';
import { GenericTile$PressEvent } from "sap/m/GenericTile";
import Context from "sap/ui/model/Context";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class Homepage extends BaseController implements IPage {
    public formatter=formatter

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        const page = new PageCL<Homepage>(this, Routes.HOMEPAGE);
        page.initialize();
    }
    
    

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    public onNavToKPIsOverview(event: GenericTile$PressEvent) {
        const sectionID=((event.getSource().getBindingContext() as Context).getObject() as { ID: string }).ID;

        this.getRouter().navTo("RouteKPIsOverview", {
            sectionID: sectionID
        });
    }
}