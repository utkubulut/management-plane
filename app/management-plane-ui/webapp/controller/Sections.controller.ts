
import BaseController from "./BaseController";
import formatter from '../model/formatter';
import { GenericTile$PressEvent } from "sap/m/GenericTile";
import Context from "sap/ui/model/Context";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import { report } from "process";
import FlexBox from "sap/m/FlexBox";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";



/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class SECTIONS extends BaseController implements IPage {
    public formatter=formatter
    private reportID:string;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        const page = new PageCL<SECTIONS>(this, Routes.SECTIONS);
        page.initialize();
    }
    
    

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.reportID=(event.getParameters().arguments as { reportID: string }).reportID;
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setTitle("Sections");
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setShowNavButton(true);
        this.applySectionFilter();
    }
    private applySectionFilter(): void {
        const binding = (((this.getView() as View).byId("fbSections") as FlexBox).getBinding("items") as ListBinding);
        const reportFilter = new Filter("reportID", FilterOperator.EQ, this.reportID); 
        binding.filter(reportFilter);
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    public onNavToKPIsOverview(event: GenericTile$PressEvent) {
        
        const reportID = ((event.getSource().getBindingContext() as Context).getObject() as { reportID: string }).reportID;
        const sectionID=((event.getSource().getBindingContext() as Context).getObject() as { ID: string }).ID;
        this.getRouter().navTo("RouteKPIsOverview", {
            reportID: reportID,
            sectionID: sectionID
        });
    
    }
}