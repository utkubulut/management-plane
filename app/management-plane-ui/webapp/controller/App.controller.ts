import UIComponent from "sap/ui/core/UIComponent";
import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import Router, { Router$BeforeRouteMatchedEvent, Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import { FlexibleColumnLayout$StateChangeEvent } from "sap/f/FlexibleColumnLayout";
import ShellBar from "sap/f/ShellBar";
import { LayoutType } from "sap/f/library";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class App extends Controller {
    private router: Router;
    private currentRouteName: string;
    private sectionID: string;
    private kpiID: string;
    private subKPI:string;
    private paragraph:string;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        this.router = (this.getOwnerComponent() as UIComponent).getRouter();
        this.router.attachRouteMatched(this.onRouteMatched, this);
        this.router.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
    }

    public onBeforeRouteMatched(event: Router$BeforeRouteMatchedEvent) {
        const component = this.getOwnerComponent() as Component;
        const layout = (event.getParameters().arguments as { layout?: string }).layout || "OneColumn";
        (component.getModel("flexibleColumnLayout") as JSONModel).setProperty("/layout", layout);
    }

    public onRouteMatched(event: Router$RouteMatchedEvent) {
        const component = this.getOwnerComponent() as Component;
        const routeName = event.getParameter("name");
        const routeArguments = event.getParameter("arguments");
        this.updateUIElements();
        this.currentRouteName = routeName as string;
        this.sectionID = (event.getParameters().arguments as { sectionID: string }).sectionID;
        this.kpiID = (event.getParameters().arguments as { kpiID: string }).kpiID;
        this.subKPI = (event.getParameters().arguments as { subKPI: string }).subKPI;
        this.paragraph = (event.getParameters().arguments as { paragraph: string }).paragraph;
    }

    public onStateChanged(event: FlexibleColumnLayout$StateChangeEvent) {
        const isNavigationArrow = event.getParameter("isNavigationArrow");
        const layout = event.getParameter("layout");

        this.updateUIElements();

        if (isNavigationArrow) {
            this.router.navTo(this.currentRouteName, {
                layout: layout
            });
        }
    }

    private updateUIElements() {
        const component = this.getOwnerComponent() as Component;
        const uiState = component.getHelper().getCurrentUIState();
        (component.getModel("flexibleColumnLayout") as JSONModel).setData(uiState);
    }

    public onNavToView(target: string): void {
       
  
 
        switch (this.currentRouteName) {
            case "RouteKPIs":
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteKPIsOverview",{
                        sectionID: this.sectionID
                    });
                break;
            case "RouteKPIsOverview":
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteHomepage");
                break;
            case "RouteKPIDetails":
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteKPIs", {
                    sectionID: this.sectionID,
                    kpiID:this.kpiID
                });
                break;
            case "RouteChangeHistory":
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteKPIDetails", {
                    layout: LayoutType.TwoColumnsMidExpanded,
                    sectionID: this.sectionID,
                    kpiID: this.kpiID,
                    subKPI: this.subKPI,
                    paragraph:this.paragraph
                });
                break;
                case "RouteUploadReport":
                    (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteReportAdministration");
                    break;
                case "RouteReportDetails":
                    (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteReportAdministration");
                    break;
            default:
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteHomepage");
                break;
        }
    
    }
}