import BaseController from "./BaseController";
import formatter from "../model/formatter";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import { IBindingParams, IKPIs } from '../types/kpis.types'
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import { ListItemBase$PressEventParameters } from "sap/m/ListItemBase";
import ColumnListItem from "sap/m/ColumnListItem";
import Context from "sap/ui/model/Context";
import Event from "sap/ui/base/Event";
import { LayoutType } from "sap/f/library";
import PageCL from "../utils/common/PageCL";
import { IPage, Routes } from "../types/global.types";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";
import ShellBar from "sap/f/ShellBar";
import Component from "../Component";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class KPIs extends BaseController implements IPage {
    public formatter = formatter;
    private sectionID: string;
    private kpiID: string;
    
    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        const page = new PageCL<KPIs>(this, Routes.KPIS);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavKPIsOverview(): void {
        this.getRouter().navTo("RouteKPIsOverview", {
            sectionID: this.sectionID
        });
    }

    public onBeforeRebindTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const filters = new Filter("sectionID", FilterOperator.EQ, this.sectionID);
        binding.filters.push(filters);
        // this.addBindingListener(binding, "dataReceived", this.onBindingDataReceivedListener.bind(this));
    }

    public onItemPressed(event: Event<ListItemBase$PressEventParameters, ColumnListItem>) {
        const subKPI = ((event.getSource().getBindingContext() as Context).getObject() as { subchapterID: string }).subchapterID;
        const paragraph = ((event.getSource().getBindingContext() as Context).getObject() as { paragraph: string }).paragraph;
        this.getRouter().navTo("RouteKPIDetails", {
            layout: LayoutType.TwoColumnsMidExpanded,
            sectionID: this.sectionID,
            kpiID: this.kpiID,
            subKPI: subKPI,
            paragraph: paragraph
        });
    }

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.sectionID = (event.getParameters().arguments as { sectionID: string }).sectionID;
        this.kpiID = (event.getParameters().arguments as { kpiID: string }).kpiID;
        const smartTable = this.byId("stKPIs") as SmartTable;
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setTitle("KPIs");
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setShowNavButton(true);

        if (smartTable.isInitialised()) {
            smartTable.rebindTable(true);
        }
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    // private setPageTitle(pageTitle?: string) {
    //     const page = (this.byId("pageKPIResults") as Page);
    //     page.setTitle(pageTitle);
    // }

    // private addBindingListener(bindingInfo: IBindingParams, eventName: string, handler: Function) {
    //     if (!bindingInfo.events[eventName]) {
    //         bindingInfo.events[eventName] = handler;
    //     } else {
    //         const originalHandler = bindingInfo.events[eventName];
    //         bindingInfo.events[eventName] = function () {
    //             handler.apply(this, arguments);
    //             originalHandler.apply(this, arguments);
    //         };
    //     }
    // }
    // private onBindingDataReceivedListener(event: ODataListBinding$DataReceivedEvent) {
    //     const results = (event.getParameter("data") as unknown as { results: IKPIs[] }).results;
    //     const kpiData = results.filter((data) =>data.ID == this.kpiID);
    //     const pageTitle = kpiData[0].subchapterName;

    //     this.setPageTitle(pageTitle);
    // }
}

