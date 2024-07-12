import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import formatter from "../model/formatter";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { IBindingParams, IKPIs } from "com/ndbs/managementplaneui/types/global.types"
import Title from "sap/m/Title";
import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
import { Binding$DataReceivedEvent } from "sap/ui/model/Binding";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ShellBar from "sap/f/ShellBar";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import FlexBox from "sap/m/FlexBox";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class KPIDetails extends BaseController {
    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */
    public formatter = formatter;
    private sectionID: string;
    private kpiID: string;
    private subKPI: string;
    public subChapterName: string;
    public onInit() {
        this.getRouter().getRoute("RouteKPIDetails")!.attachMatched(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToHomepage(): void {
        this.getRouter().navTo("RouteHomepage");
    }

    public onNavToKPIs() {
        this.getRouter().navTo("RouteKPIs", {
            sectionID: this.sectionID,
            kpiID: this.kpiID
        });
    }
    public onBeforeRebindTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const kpiFilters = new Filter("kpiID", FilterOperator.EQ, this.kpiID);
        binding.filters.push(kpiFilters);
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.sectionID = (event.getParameters() as IBindingParams).arguments.sectionID;
        this.kpiID = (event.getParameters() as IBindingParams).arguments.kpiID;
        const subKPI = (event.getParameters() as IBindingParams).arguments.subKPI;
        const paragraph = (event.getParameters() as IBindingParams).arguments.paragraph;
        const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

        if (navigation.type == "reload") {
            this.onNavToKPIs();
        }

        (this.byId("kpiDetailTitle") as Title).setText(subKPI + "para." + paragraph);
        (this.byId("sfKPIsReport") as SmartForm).bindElement("/VKPIsReports(kpiID=guid'" + this.kpiID + "',kpiParagraph='" + paragraph + "')");

        ((this.getView() as View).getModel() as ODataModel).read("/KPIs(ID=guid'" + (this.kpiID) + "',paragraph='" + paragraph + "')", {
            urlParameters: {
                "$expand": "documents",
            },
            success: (data: IKPIs) =>  {
                this.subChapterName = data.subchapterName;
                (this.byId("sbKPIs") as ShellBar).setTitle("Details of " + this.subChapterName);
                (this.byId("oplKpi") as ObjectPageLayout).bindElement({
                    path: "/KPIs(ID=guid'" + (this.kpiID) + "',paragraph='" + paragraph + "')",
                    events: {
                        dataReceived: (event: Binding$DataReceivedEvent) => {
                            (this.byId("stDocuments") as SmartTable).rebindTable(true);
                        }
                    }
                });
            },
            error: () => {
                /**
                 * Add error messages
                 */
            }
        });
    }
}

