import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import formatter from "../model/formatter";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { IBindingParams, IKPIs, IReportHistory, IUserAPI } from "com/ndbs/managementplaneui/types/kpis.types"
import Title from "sap/m/Title";
import ObjectPageLayout, { ObjectPageLayout$BeforeNavigateEvent } from "sap/uxap/ObjectPageLayout";
import SmartTable, { SmartTable$BeforeRebindTableEvent } from "sap/ui/comp/smarttable/SmartTable";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ShellBar from "sap/f/ShellBar";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import { Menu$ItemSelectEvent } from "sap/ui/unified/Menu";
import { LayoutType } from "sap/f/library";
import UserAPI from "../utils/session/UserAPI";
import ODataCreateCL from "ui5/antares/odata/v2/ODataCreateCL";
import { IPage, Routes } from "../types/global.types";
import PageCL from "../utils/common/PageCL";
import { Model$RequestFailedEvent } from "sap/ui/model/Model";
import Component from "../Component";
import ObjectPageSection from "sap/uxap/ObjectPageSection";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ReportDetails extends BaseController implements IPage {
    public formatter = formatter;
    private reportID: string;
    
    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit() {
        const page = new PageCL<ReportDetails>(this, Routes.REPORT_DETAILS);
        page.initialize();
        const oOPL = (this.getView()as View).byId("oplReportDetails") as ObjectPageLayout;
        oOPL.attachBeforeNavigate(this.onBeforeNavigate.bind(this));
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToHomepage(): void {
        this.getRouter().navTo("RouteHomepage");
    }
    public onBeforeRebindTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const kpiFilters = new Filter("reportID", FilterOperator.EQ, this.reportID);
        binding.filters.push(kpiFilters);
    }
    public onBeforeRebindTreeTable(event: SmartTable$BeforeRebindTableEvent) {
        const binding = event.getParameter("bindingParams") as IBindingParams;
        const reportFilters = new Filter("reportID", FilterOperator.EQ, this.reportID);
        binding.filters.push(reportFilters);
    }
    public onBeforeNavigate(event: ObjectPageLayout$BeforeNavigateEvent) {
        const oOPL = ((this.getView() as View).byId("oplReportDetails")as ObjectPageLayout);
        const oSection = (event.getParameter("section")as ObjectPageSection);
        event.preventDefault();
        oOPL.setSelectedSection(oSection);
    }

    public async onObjectMatched(event: Route$PatternMatchedEvent): Promise<void> {
        const oDataModel = this.getComponentModel();
        oDataModel.attachRequestFailed({}, this.onODataRequestFail, this);
        this.reportID = (event.getParameters() as IBindingParams).arguments.reportID;
        const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setTitle("Report Details");
        (((this.getOwnerComponent() as Component).getRootControl() as View ).byId("sbApp") as ShellBar).setShowNavButton(true);
        (this.byId("stTreeDocuments") as SmartTable).rebindTable(true);

        // if (navigation.type == "reload") {
        //     this.onNavToKPIs();
        // }
        //this.setReportChangeHistory();

        // (this.byId("kpiDetailTitle") as Title).setText(this.subKPI + "para." + this.paragraph);
        (this.byId("sfReportDescription") as SmartForm).bindElement("/ReportSet(reportID=guid'" + this.reportID +"')");

        ((this.getView() as View).getModel() as ODataModel).read("/ReportSet(reportID=guid'" + this.reportID +"')", {
            urlParameters: {
                "$expand": "documents",
            },
            success: (data: IKPIs) =>  {
                //this.subChapterName = data.subchapterName;
                // (this.byId("sbKPIs") as ShellBar).setTitle("Details of " + this.subChapterName);
                (this.byId("oplReportDetails") as ObjectPageLayout).bindElement({
                    path: "/VReportSet(guid'" + (this.reportID) + "')",
                    events: {
                        dataReceived: () => {
                            (this.byId("stDataSources") as SmartTable).rebindTable(true);
                        }
                    }
                });
            }
        });
    }

    public onODataRequestFail(event: Model$RequestFailedEvent): void {
        this.openMessagePopover();
    }

    /* ======================================================================================================================= */
    /* Private Functions                                                                                                       */
    /* ======================================================================================================================= */

    // private onMenuAction(event: Menu$ItemSelectEvent){
    //     const action = ((event.getParameter("item")as any).getText()as string);
    //     if(action ==="Change History"){
    //         this.getRouter().navTo("RouteChangeHistory", {
    //         layout: LayoutType.ThreeColumnsMidExpanded,
    //         sectionID: this.sectionID,
    //         kpiID: this.kpiID,
    //         subKPI: this.subKPI,
    //         paragraph: this.paragraph
    //         });
    //     }
    // }
    
    private async setReportChangeHistory() {
        const user = new UserAPI(this);
        const session = await user.getLoggedOnUser();
        const userSession :IReportHistory = {
            fullName: session.firstname + " "+session.lastname,
            modifiedType: "Regenerate the report",
            modifiedContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Curabitur aliquet quam id dui posuere blandit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Nulla quis lorem ut libero malesuada feugiat.",
            avatar: session.firstname.substring(0, 1) + session.lastname.substring(0, 1) as string,
            iconType: "sap-icon://user-edit"
        };
        const creator = new ODataCreateCL<IReportHistory>(this, "ReportHistory");

        creator.setData(userSession);
        creator.create();
    }

    private onCloseColumnLayout() {
        this.getRouter().navTo("RouteReportAdministration");
    }
}

