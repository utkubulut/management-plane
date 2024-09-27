import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Card from "sap/f/Card";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import { Button$PressEvent } from "sap/ui/commons/Button";
import { ListBase$UpdateFinishedEvent } from "sap/m/ListBase";
import List from "sap/m/List";
import SmartChart, { SmartChart$AfterVariantInitialiseEvent, SmartChart$BeforeRebindChartEvent } from "sap/ui/comp/smartchart/SmartChart";
import { IBindingParams } from "../types/kpis.types";
import Header from "sap/f/cards/Header";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import Context from "sap/ui/model/Context";
import { IPage, Routes } from "../types/global.types";
import PageCL from "../utils/common/PageCL";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Component from "../Component";
import ShellBar from "sap/f/ShellBar";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class KPIsOverview extends BaseController implements IPage {
    public formatter = formatter;
    private sectionID: string;
    private reportID: string;
    private sectionType: string;
    private sectionName: string;
    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        const page = new PageCL<KPIsOverview>(this, Routes.KPIS_OVERVIEW);
        page.initialize();
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToHomepage(): void {
        this.getRouter().navTo("RouteHomepage");
    }

    public onCardPress(event: Button$PressEvent) {
        const reportID = event.getSource().getCustomData()[0].getValue();
        const sectionID = event.getSource().getCustomData()[1].getValue();
        const kpiID = event.getSource().getCustomData()[2].getValue();

        this.getRouter().navTo('RouteKPIs', {
            reportID: reportID,
            sectionID: sectionID,
            kpiID: kpiID
        });
    }

    public onChartInit(event: SmartChart$AfterVariantInitialiseEvent) {
        event.getSource().getChartAsync().then((innerChart) => {
            innerChart.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                }
            });
        });
    }

    public onBeforeRebindChart(event: SmartChart$BeforeRebindChartEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const sectionFilter = new Filter("sectionID", FilterOperator.EQ, this.sectionID);
        const reportFilter = new Filter("reportID", FilterOperator.EQ, this.reportID); // Assuming this.reportID is available
        const combinedFilter = new Filter({
            filters: [sectionFilter, reportFilter],
            and: true // Use AND logic
        });
        binding.filters.push(combinedFilter);
    }

    public onBeforeRebindTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const sectionFilter = new Filter("sectionID", FilterOperator.EQ, this.sectionID);
        const reportFilter = new Filter("reportID", FilterOperator.EQ, this.reportID); // Assuming this.reportID is available
        const combinedFilter = new Filter({
            filters: [sectionFilter, reportFilter],
            and: true
        });
        binding.filters.push(combinedFilter);
    }

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.sectionID = (event.getParameters().arguments as { sectionID: string }).sectionID;
        this.reportID = (event.getParameters().arguments as { reportID: string }).reportID;
        this.applySectionFilter();
        this.rebindSmartComponent();
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setTitle("KPI Overview");
        (((this.getOwnerComponent() as Component).getRootControl() as View).byId("sbApp") as ShellBar).setShowNavButton(true);

    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    private onKPIUpdateFinished(event: ListBase$UpdateFinishedEvent) {
        this.sectionType = (((this.byId("fbKPIsOverview") as List).getItems()[0].getBindingContext() as Context).getObject() as { sectionType: string }).sectionType;
        this.sectionName = (((this.byId("fbKPIsOverview") as List).getItems()[0].getBindingContext() as Context).getObject() as { sectionName: string }).sectionName;

        (((this.byId("cardHKPIsOverview") as Header).setTitle(this.sectionType + " - " + this.sectionName)));
        ((this.byId("stKPIs") as SmartTable).setHeader(this.sectionType + " - " + this.sectionName));
    }

    private applySectionFilter(): void {
        const listBinding = (((this.getView() as View).byId("fbKPIsOverview") as Card).getBinding("items") as ListBinding);
        const tileBinding = (((this.getView() as View).byId("fbKPIsDetail") as Card).getBinding("items") as ListBinding);
        const sectionFilter = new Filter("sectionID", FilterOperator.EQ, this.sectionID);
        const reportFilter = new Filter("reportID", FilterOperator.EQ, this.reportID); // Assuming this.reportID is available
        const combinedFilter = new Filter({
            filters: [sectionFilter, reportFilter],
            and: true
        });
        tileBinding.filter(combinedFilter);
        listBinding.filter(combinedFilter);
    }

    private rebindSmartComponent() {
        const smartChart = (this.getView() as View).byId("scKPIState") as SmartChart;
        const smartTable = (this.getView() as View).byId("stKPIs") as SmartTable;

        if (smartChart.isInitialised()) {
            smartChart.rebindChart();
        }

        if (smartTable.isInitialised()) {
            smartTable.rebindTable(true);
        }
    }
}

