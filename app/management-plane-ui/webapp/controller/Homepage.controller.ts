
import BaseController from "./BaseController";
import formatter from '../model/formatter';
import { GenericTile$PressEvent } from "sap/m/GenericTile";
import Context from "sap/ui/model/Context";

/**
 * @namespace com.ndbs.managementplaneui.controller
 */
export default class Homepage extends BaseController {

    public formatter=formatter

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onNavToKPIs(event: GenericTile$PressEvent) {
        const sectionID=((event.getSource().getBindingContext() as Context).getObject() as { ID: string }).ID;

        this.getRouter().navTo("RouteKPIs", {
            sectionID: sectionID
        });
    }
}