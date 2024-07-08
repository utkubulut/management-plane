import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Card from "sap/f/Card";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import { Button$PressEvent } from "sap/ui/commons/Button";
import { ListBase$UpdateFinishedEvent } from "sap/m/ListBase";
import List from "sap/m/List";
import Table from "sap/m/Table";
import SmartChart, { SmartChart$AfterVariantInitialiseEvent, SmartChart$BeforeRebindChartEvent } from "sap/ui/comp/smartchart/SmartChart";
import { IBindingParams } from "../types/global.types";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class KPIsOverview extends BaseController {

    private sectionID: string;
    private sectionType: string;
    private sectionName: string;
    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        this.getRouter().getRoute("RouteKPIsOverview")!.attachMatched(this.onObjectMatched, this);

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToHomepage(): void {
        this.getRouter().navTo("RouteHomepage");
    }

    public onCardPress(event: Button$PressEvent) {
        const sectionID = event.getSource().getCustomData()[0].getValue();
        const kpiID = event.getSource().getCustomData()[1].getValue();
        this.getRouter().navTo('RouteKPIs', {
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

    public onBeforerebindChart(event: SmartChart$BeforeRebindChartEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams
        const sectionFilter = new Filter("sectionID", FilterOperator.EQ, this.sectionID);
        binding.filters.push(sectionFilter);
    }


    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.sectionID = (event.getParameters().arguments as { sectionID: string }).sectionID;
        this.applySectionFilter();
        this.rebindChart();
    }
    private onKPIUpdateFinished(event: ListBase$UpdateFinishedEvent) {
        this.sectionType = ((this.byId("fbKPIsOverview") as List).getItems()[0].getBindingContext() as any).getObject().SectionType;
        this.sectionName = ((this.byId("fbKPIsOverview") as List).getItems()[0].getBindingContext() as any).getObject().SectionName;

        ((this.byId("cardHKPIsOverview") as any).setTitle(this.sectionType + " - " + this.sectionName) as any);
        ((this.byId("cardHKPIsState") as any).setTitle(this.sectionType + " - " + this.sectionName) as any);
    }

    private applySectionFilter(): void {
        const listBinding = (((this.getView() as View).byId("fbKPIsOverview") as Card).getBinding("items") as ListBinding);
        const tileBinding = (((this.getView() as View).byId("fbKPIsDetail") as Card).getBinding("items") as ListBinding);
        const tableBinding = (((this.getView() as View).byId("tableKPIsOverview") as Table).getBinding("items") as ListBinding);
        const filter = new Filter("sectionID", FilterOperator.EQ, this.sectionID);

        tileBinding.filter(filter);
        listBinding.filter(filter);
        tableBinding.filter(filter);
    }

    private rebindChart() {
        const smartChart = (this.getView() as View).byId("scKPIState") as SmartChart;

        if (smartChart.isInitialised()) {
            smartChart.rebindChart();
        }
    }
}

