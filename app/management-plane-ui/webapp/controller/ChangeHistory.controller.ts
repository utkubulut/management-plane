import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import { IBindingParams } from "../types/global.types";
import { LayoutType } from "sap/f/library";


/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class ChangeHistory extends BaseController {

    private sectionID: string;
    private kpiID: string;
    private subKPI: string;
    private paragraph:string;
    public subChapterName: string;

    public onInit() {
        this.getRouter().getRoute("RouteChangeHistory")!.attachMatched(this.onObjectMatched, this);
    }
    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.sectionID = (event.getParameters() as IBindingParams).arguments.sectionID;
        this.kpiID = (event.getParameters() as IBindingParams).arguments.kpiID;
        this.subKPI = (event.getParameters() as IBindingParams).arguments.subKPI;
        this.paragraph = (event.getParameters() as IBindingParams).arguments.paragraph;

    }
    public onNavToKPIsDetails() {
        this.getRouter().navTo("RouteKPIDetails", {
            layout: LayoutType.TwoColumnsMidExpanded,
            sectionID: this.sectionID,
            kpiID: this.kpiID,
            subKPI: this.subKPI,
            paragraph: this.paragraph
        });
    }
}