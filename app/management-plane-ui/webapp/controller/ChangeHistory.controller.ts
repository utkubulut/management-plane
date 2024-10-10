import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import { IBindingParams } from "../types/kpis.types";
import { LayoutType } from "sap/f/library";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Component from "../Component";
import ShellBar from "sap/f/ShellBar";
import View from "sap/ui/core/mvc/View";




/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ChangeHistory extends BaseController implements IPage {

    private sectionID: string;
    private kpiID: string;
    private subKPI: string;
    private paragraph: string;
    private reportID: string;
    public subChapterName: string;


    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        const page = new PageCL<ChangeHistory>(this, Routes.CHANGE_HISTORY);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.sectionID = (event.getParameters() as IBindingParams).arguments.sectionID;
        this.kpiID = (event.getParameters() as IBindingParams).arguments.kpiID;
        this.subKPI = (event.getParameters() as IBindingParams).arguments.subKPI;
        this.paragraph = (event.getParameters() as IBindingParams).arguments.paragraph;
        this.reportID = (event.getParameters() as IBindingParams).arguments.reportID;
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setTitle("Change History");
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setShowNavButton(true);

    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    public onNavToKPIsDetails() {
        this.getRouter().navTo("RouteKPIDetails", {
            reportID: this.reportID,
            layout: LayoutType.TwoColumnsMidExpanded,
            sectionID: this.sectionID,
            kpiID: this.kpiID,
            subKPI: this.subKPI,
            paragraph: this.paragraph
        });
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    private onCloseColumnLayout() {
        this.onNavToKPIsDetails();
    }
}